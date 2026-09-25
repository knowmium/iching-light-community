import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const source = readFileSync(path.join(process.cwd(), 'components/reading-cards.tsx'), 'utf8');

describe('reading card order', () => {
  it('places the slow Vision card after Tao and before Carrying Forward', () => {
    const taoIndex = source.indexOf("id: 'tao'");
    const visionIndex = source.indexOf("id: 'vision'");
    const synthesisIndex = source.indexOf("id: 'synthesis'");

    expect(taoIndex).toBeGreaterThan(-1);
    expect(visionIndex).toBeGreaterThan(taoIndex);
    expect(synthesisIndex).toBeGreaterThan(visionIndex);
  });
});
