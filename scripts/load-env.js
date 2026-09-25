/**
 * Local environment loader for this fork.
 *
 * It loads a local `.env` file if one exists, giving real environment variables
 * priority so they are never shadowed by placeholder values.
 *
 * This fork deliberately does NOT map any platform-injected owner variable into
 * an `EXPO_PUBLIC_*` variable. Expo inlines every `EXPO_PUBLIC_*` value it can
 * see into the JavaScript bundle, and this app is published publicly as an APK.
 * Exposing the author's identity or any account identifier in a distributed
 * build would be both a privacy leak and a security risk, so the mapping was
 * removed rather than merely left unused.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  lines.forEach((line) => {
    // Skip comments and empty lines
    if (!line || line.trim().startsWith("#")) return;

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, ""); // Remove quotes

      // Only set if not already defined in the environment
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}
