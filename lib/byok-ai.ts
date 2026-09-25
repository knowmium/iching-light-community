import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { getApiKey } from './api-key-store';
import {
  PROVIDER_DETAILS,
  providerSupportsVision,
  type AIProvider,
} from './community-settings';
import {
  parseAnthropicText,
  parseGeminiText,
  parseOpenAIText,
  type ProviderJson,
} from './ai-response-parsers';
import { downscaleResize, shouldDownscale } from './vision-optimize';

const TEXT_TIMEOUT_MS = 90_000;
const IMAGE_TIMEOUT_MS = 240_000;
const IMAGE_DIRECTORY = `${FileSystem.documentDirectory ?? ''}community-visions/`;

export interface InterpretationInput {
  question: string;
  hexagramNumber: number;
  hexagramName: string;
  hexagramChinese: string;
  judgmentText: string;
  imageText: string;
  changingLinesText: Array<{ lineNumber: number; text: string }>;
  transformedHexagramNumber?: number;
  transformedHexagramName?: string;
}

export interface SynthesisInput {
  question: string;
  hexagramNumber: number;
  hexagramName: string;
  interpretation: string;
  taoChapter: number;
  taoText: string;
  wisdomQuote?: string;
  transformedHexagramName?: string;
}

type JsonResponse = ProviderJson;

export class BYOKError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'BYOKError';
  }
}

async function fetchJson(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<JsonResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    const data = (await response.json().catch(() => ({}))) as JsonResponse;

    if (!response.ok) {
      const nestedError = data.error as { message?: string } | undefined;
      const message = nestedError?.message || `The provider returned HTTP ${response.status}.`;
      throw new BYOKError(message, response.status);
    }

    return data;
  } catch (error) {
    if (error instanceof BYOKError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new BYOKError('The provider took too long to respond. Try again later.');
    }
    throw new BYOKError(error instanceof Error ? error.message : 'The provider request failed.');
  } finally {
    clearTimeout(timeout);
  }
}

function providerHeaders(provider: AIProvider, apiKey: string): Record<string, string> {
  if (provider === 'openai') {
    return {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  if (provider === 'anthropic') {
    return {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
      ...(Platform.OS === 'web' ? { 'anthropic-dangerous-direct-browser-access': 'true' } : {}),
    };
  }

  return {
    'x-goog-api-key': apiKey,
    'Content-Type': 'application/json',
  };
}

async function requireApiKey(provider: AIProvider): Promise<string> {
  const apiKey = await getApiKey(provider);
  if (!apiKey) {
    throw new BYOKError(`Add your ${PROVIDER_DETAILS[provider].keyLabel} in Settings first.`);
  }
  return apiKey;
}

async function generateProviderText(
  provider: AIProvider,
  systemPrompt: string,
  userPrompt: string,
  maxOutputTokens: number,
): Promise<string> {
  const apiKey = await requireApiKey(provider);
  let data: JsonResponse;
  let text = '';

  if (provider === 'openai') {
    data = await fetchJson(
      'https://api.openai.com/v1/responses',
      {
        method: 'POST',
        headers: providerHeaders(provider, apiKey),
        body: JSON.stringify({
          model: PROVIDER_DETAILS.openai.textModel,
          instructions: systemPrompt,
          input: userPrompt,
          max_output_tokens: maxOutputTokens,
        }),
      },
      TEXT_TIMEOUT_MS,
    );
    text = parseOpenAIText(data);
  } else if (provider === 'anthropic') {
    data = await fetchJson(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: providerHeaders(provider, apiKey),
        body: JSON.stringify({
          model: PROVIDER_DETAILS.anthropic.textModel,
          max_tokens: maxOutputTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      },
      TEXT_TIMEOUT_MS,
    );
    text = parseAnthropicText(data);
  } else {
    data = await fetchJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${PROVIDER_DETAILS.gemini.textModel}:generateContent`,
      {
        method: 'POST',
        headers: providerHeaders(provider, apiKey),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
          generationConfig: {
            maxOutputTokens,
            temperature: 0.8,
          },
        }),
      },
      TEXT_TIMEOUT_MS,
    );
    text = parseGeminiText(data);
  }

  if (!text) throw new BYOKError('The provider returned an empty response.');
  return text;
}

export async function testProviderConnection(provider: AIProvider, apiKey: string): Promise<void> {
  const normalizedKey = apiKey.trim();
  if (!normalizedKey) throw new BYOKError('Enter an API key first.');

  const config: Record<AIProvider, { url: string; headers: Record<string, string> }> = {
    openai: {
      url: 'https://api.openai.com/v1/models',
      headers: providerHeaders('openai', normalizedKey),
    },
    anthropic: {
      url: 'https://api.anthropic.com/v1/models?limit=1',
      headers: providerHeaders('anthropic', normalizedKey),
    },
    gemini: {
      url: 'https://generativelanguage.googleapis.com/v1beta/models?pageSize=1',
      headers: providerHeaders('gemini', normalizedKey),
    },
  };

  await fetchJson(config[provider].url, { method: 'GET', headers: config[provider].headers }, TEXT_TIMEOUT_MS);
}

export async function generateInterpretation(
  provider: AIProvider,
  input: InterpretationInput,
): Promise<string> {
  const changingLinesContext = input.changingLinesText.length
    ? `\n\nChanging Lines:\n${input.changingLinesText
        .map((line) => `Line ${line.lineNumber}: ${line.text}`)
        .join('\n')}`
    : '';
  const transformationContext = input.transformedHexagramNumber && input.transformedHexagramName
    ? `\n\nThe changing lines transform this into Hexagram ${input.transformedHexagramNumber}: ${input.transformedHexagramName}. This suggests where the situation is naturally evolving.`
    : '';

  const systemPrompt = `You are a wise, warm friend who knows the I Ching well. You are helping someone think through something that matters to them, not predicting the future.

Your voice is warm, thoughtful, grounded, curious, and conversational. Use gender-neutral language. Weave in nature, science, or systems imagery only when it fits naturally.

FORMATTING RULES:
- Do not use markdown symbols or numbered lists.
- Put these exact uppercase section titles on their own lines.
- Keep the response between 400 and 500 words.

WHAT THIS PATTERN IS ABOUT
Write 2-3 grounded sentences about what this hexagram represents.

HOW THIS MIGHT SPEAK TO YOUR SITUATION
Write 2-3 paragraphs specific to the question. Surface assumptions and offer a fresh angle.

QUESTIONS TO SIT WITH
Write exactly 4 unnumbered questions, each on its own line.

A THOUGHT TO CARRY FORWARD
Write 1-2 encouraging but honest sentences. Offer a nudge, not a prediction.`;

  const userPrompt = `The seeker is thinking about: "${input.question}"

They cast Hexagram ${input.hexagramNumber}: ${input.hexagramName} (${input.hexagramChinese})

The traditional Judgment says: "${input.judgmentText}"

The Image says: "${input.imageText}"${changingLinesContext}${transformationContext}

Help them see their situation in a new way.`;

  return generateProviderText(provider, systemPrompt, userPrompt, 1400);
}

export async function generateSynthesis(
  provider: AIProvider,
  input: SynthesisInput,
): Promise<string> {
  const systemPrompt = `You are a wise guide offering the final reflection in an I Ching reading. Weave together the hexagram, the Tao Te Ching verse, and the seeker's question into a warm, poetic, forward-looking conclusion.

Do not use markdown or numbered lists. Write three natural paragraphs totaling 150-200 words. First honor the seeking and name the question. Then connect the hexagram and Tao wisdom. Finally describe what may become possible and end with a memorable image or truth. Never make a prediction.`;

  const userPrompt = `The seeker asked: "${input.question}"

They received Hexagram ${input.hexagramNumber}: ${input.hexagramName}${input.transformedHexagramName ? `, transforming into ${input.transformedHexagramName}` : ''}.

The interpretation offered:
${input.interpretation.substring(0, 1200)}

Tao Te Ching, Chapter ${input.taoChapter}:
"${input.taoText}"

${input.wisdomQuote ? `Additional wisdom: "${input.wisdomQuote}"` : ''}

Draw these threads together into a concise closing reflection.`;

  return generateProviderText(provider, systemPrompt, userPrompt, 700);
}

function findGeminiImage(data: JsonResponse): { base64: string; mimeType: string } | null {
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== 'object') continue;
    const parts = (candidate as { content?: { parts?: unknown } }).content?.parts;
    if (!Array.isArray(parts)) continue;
    for (const part of parts) {
      if (!part || typeof part !== 'object') continue;
      const inlineData = (part as { inlineData?: { data?: string; mimeType?: string } }).inlineData;
      if (inlineData?.data) {
        return { base64: inlineData.data, mimeType: inlineData.mimeType || 'image/png' };
      }
    }
  }
  return null;
}

/**
 * Re-encode a generated Vision image at display-appropriate size.
 *
 * Returns a new file URI on success, or the original URI when the image is
 * already small enough, the platform is web, or the optimizer is unavailable.
 * Failure is never fatal: the caller always receives a usable URI.
 *
 * This changes only how the returned pixels are stored. The provider request,
 * the prompt, and the model output are untouched.
 */
async function optimizeVisionImage(uri: string): Promise<string> {
  if (Platform.OS === 'web') return uri;

  try {
    // Measure first so an image already under the cap is never upscaled.
    const probe = ImageManipulator.manipulate(uri);
    const loaded = await probe.renderAsync();
    const { width, height } = loaded;
    loaded.release();
    probe.release();

    if (!shouldDownscale(width, height)) return uri;

    const context = ImageManipulator.manipulate(uri);
    context.resize(downscaleResize(width, height));
    const scaled = await context.renderAsync();
    const saved = await scaled.saveAsync({ format: SaveFormat.PNG, compress: 1 });
    scaled.release();
    context.release();

    return saved.uri ?? uri;
  } catch {
    // Keep the provider image untouched if anything about the optimizer fails.
    return uri;
  }
}

async function persistBase64Image(base64: string, mimeType: string): Promise<string> {
  if (Platform.OS === 'web' || !FileSystem.documentDirectory) {
    return `data:${mimeType};base64,${base64}`;
  }

  await FileSystem.makeDirectoryAsync(IMAGE_DIRECTORY, { intermediates: true });
  const extension = mimeType.includes('jpeg') ? 'jpg' : 'png';
  const uri = `${IMAGE_DIRECTORY}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;
  await FileSystem.writeAsStringAsync(uri, base64, { encoding: FileSystem.EncodingType.Base64 });
  // Re-encode once at display size: the stored file stays small, the card
  // decodes fewer pixels, and the reading archive keeps its size in check.
  return optimizeVisionImage(uri);
}

export async function generateVisionImage(
  provider: AIProvider,
  input: { hexagramName: string; question: string },
): Promise<string> {
  if (!providerSupportsVision(provider)) {
    throw new BYOKError(`${PROVIDER_DETAILS[provider].name} does not provide image generation.`);
  }

  const apiKey = await requireApiKey(provider);
  const prompt = `Create a square 1-bit MacPaint-style illustration inspired by the I Ching hexagram "${input.hexagramName}" and the theme of this question: "${input.question}". Use a solid pure black background with crisp pure white line art only. No gray, no color, no gradients, no text, no letters, no symbols from writing systems. Use simple contemplative nature imagery such as trees, rivers, mountains, wind, clouds, or stones. Keep the composition iconic, balanced, sparse, and readable on a small near-square phone display.`;

  if (provider === 'openai') {
    const data = await fetchJson(
      'https://api.openai.com/v1/images/generations',
      {
        method: 'POST',
        headers: providerHeaders(provider, apiKey),
        body: JSON.stringify({
          model: PROVIDER_DETAILS.openai.imageModel,
          prompt,
          size: '1024x1024',
          quality: 'low',
          output_format: 'png',
          n: 1,
        }),
      },
      IMAGE_TIMEOUT_MS,
    );
    const images = Array.isArray(data.data) ? data.data : [];
    const first = images[0] as { b64_json?: string } | undefined;
    if (!first?.b64_json) throw new BYOKError('OpenAI returned no image data.');
    return persistBase64Image(first.b64_json, 'image/png');
  }

  const data = await fetchJson(
    `https://generativelanguage.googleapis.com/v1/models/${PROVIDER_DETAILS.gemini.imageModel}:generateContent`,
    {
      method: 'POST',
      headers: providerHeaders(provider, apiKey),
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      }),
    },
    IMAGE_TIMEOUT_MS,
  );
  const image = findGeminiImage(data);
  if (!image) throw new BYOKError('Gemini returned no image data.');
  return persistBase64Image(image.base64, image.mimeType);
}

export function formatBYOKError(error: unknown): string {
  if (error instanceof BYOKError) return error.message;
  return error instanceof Error ? error.message : 'The AI provider request failed.';
}
