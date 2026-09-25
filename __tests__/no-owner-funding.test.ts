import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * This fork must never route AI usage through the author's account, and must
 * never contact a Manus-hosted service on the user's behalf.
 *
 * The APK audit checks the compiled bundle; this test keeps the guarantee in
 * source so a future edit cannot quietly reintroduce an owner-funded path.
 */

const ROOT = process.cwd();
const CLIENT_DIRS = ['app', 'components', 'hooks', 'lib', 'constants', 'data'];
const IGNORED_DIRS = new Set(['node_modules', '.git', '.expo', 'dist', 'dist-android']);

/** Hosts the app is allowed to send a request to. */
const ALLOWED_REQUEST_HOSTS = new Set([
  'api.openai.com',
  'api.anthropic.com',
  'generativelanguage.googleapis.com',
]);

function collectSourceFiles(dir: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (IGNORED_DIRS.has(entry)) continue;
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectSourceFiles(full, files);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const clientSources = CLIENT_DIRS.flatMap((dir) => collectSourceFiles(path.join(ROOT, dir)))
  .filter((file) => !file.includes('.test.'));

/** Absolute URLs passed directly to fetch(). */
function fetchTargets(source: string): string[] {
  const targets: string[] = [];
  for (const match of source.matchAll(/fetch\(\s*[`'"](https:\/\/[^`'"]+)[`'"]/g)) {
    targets.push(match[1]);
  }
  for (const match of source.matchAll(/fetchJson\(\s*[`'"](https:\/\/[^`'"]+)[`'"]/g)) {
    targets.push(match[1]);
  }
  return targets;
}

describe('client sources stay bring-your-own-key', () => {
  it('collects the client source tree', () => {
    expect(clientSources.length).toBeGreaterThan(20);
  });

  it('contains no owner-funded or Manus-hosted endpoint', () => {
    const forbidden = [
      'forge.manus',
      'manus-storage',
      'api.manus.im',
      'BUILT_IN_FORGE',
      '/api/trpc',
      '/api/oauth',
      '/api/auth',
    ];
    const offenders: string[] = [];

    for (const file of clientSources) {
      const source = readFileSync(file, 'utf8');
      for (const needle of forbidden) {
        if (source.includes(needle)) {
          offenders.push(`${path.relative(ROOT, file)} -> ${needle}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('sends requests only to the three supported provider hosts', () => {
    const observed = new Set<string>();
    const offenders: string[] = [];

    for (const file of clientSources) {
      for (const target of fetchTargets(readFileSync(file, 'utf8'))) {
        const host = new URL(target).host.toLowerCase();
        observed.add(host);
        if (!ALLOWED_REQUEST_HOSTS.has(host)) {
          offenders.push(`${path.relative(ROOT, file)} -> ${host}`);
        }
      }
    }

    expect(offenders).toEqual([]);
    // The fork must actually reach all three providers it advertises.
    expect([...observed].sort()).toEqual(
      ['api.anthropic.com', 'api.openai.com', 'generativelanguage.googleapis.com'].sort(),
    );
  });

  it('declares no hard-coded provider credential', () => {
    const offenders: string[] = [];
    for (const file of clientSources) {
      const source = readFileSync(file, 'utf8');
      if (/\bsk-[A-Za-z0-9]{16,}/.test(source)) {
        offenders.push(`${path.relative(ROOT, file)} -> sk- literal`);
      }
      if (/\bAIza[A-Za-z0-9_-]{20,}/.test(source)) {
        offenders.push(`${path.relative(ROOT, file)} -> Google API key literal`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
