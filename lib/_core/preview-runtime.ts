/**
 * Preview runtime — web-only safe-area bridge.
 *
 * This fork has no accounts and no backend. The only hosting integration that
 * remains is a small, opt-in web nicety: when the exported web build is shown
 * inside a preview frame, that frame can report its safe-area insets so the
 * fixed-position oracle screens are not clipped.
 *
 * Nothing here calls the network. Messages are accepted only from the parent
 * window, only when the app is actually framed, and only for the safe-area
 * message type.
 */
import { Platform } from "react-native";
import type { Metrics } from "react-native-safe-area-context";

type SafeAreaInsets = { top: number; right: number; bottom: number; left: number };
type SafeAreaCallback = (metrics: Metrics) => void;

interface PreviewFrameMessage {
  type: "SpacePreviewerChannel";
  payload: {
    type: string;
    from: "container" | "content";
    to: "container" | "content";
    payload: Record<string, unknown>;
  };
}

let initialized = false;
let safeAreaCallback: SafeAreaCallback | null = null;

function isWeb(): boolean {
  return Platform.OS === "web";
}

function isInIframe(): boolean {
  if (!isWeb()) return false;
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin access throws; that means we are definitely framed.
    return true;
  }
}

function isValidInsets(payload: Record<string, unknown>): payload is SafeAreaInsets {
  return (
    typeof payload.top === "number" &&
    typeof payload.bottom === "number" &&
    typeof payload.left === "number" &&
    typeof payload.right === "number"
  );
}

function getParentOrigin(): string {
  try {
    return document.referrer ? new URL(document.referrer).origin : "";
  } catch {
    return "";
  }
}

function handleMessage(event: MessageEvent<unknown>): void {
  const parentOrigin = getParentOrigin();
  // Only trust our own parent frame.
  if (!parentOrigin || event.origin !== parentOrigin || event.source !== window.parent) {
    return;
  }

  const data = event.data as PreviewFrameMessage | undefined;
  if (!data || data.type !== "SpacePreviewerChannel") return;

  const { payload } = data;
  if (!payload || payload.to !== "content") return;

  if (payload.type === "setSafeAreaInsets" && isValidInsets(payload.payload) && safeAreaCallback) {
    const insets = payload.payload;
    const frame = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };
    safeAreaCallback({ insets, frame });
  }
}

/**
 * Subscribe to safe-area updates from the hosting frame.
 * Returns an unsubscribe function.
 */
export function subscribeSafeAreaInsets(callback: SafeAreaCallback): () => void {
  safeAreaCallback = callback;
  return () => {
    if (safeAreaCallback === callback) {
      safeAreaCallback = null;
    }
  };
}

/** Register the preview listener. Does nothing outside a web iframe. */
export function initPreviewRuntime(): void {
  if (!isWeb() || !isInIframe() || initialized) return;
  initialized = true;
  window.addEventListener("message", handleMessage);
}
