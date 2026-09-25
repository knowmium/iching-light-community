import { describe, expect, it } from 'vitest';

import { parseAnthropicText, parseGeminiText, parseOpenAIText } from './ai-response-parsers';

describe('AI provider response parsers', () => {
  it('collects OpenAI output text across message items', () => {
    expect(parseOpenAIText({
      output: [
        { type: 'reasoning', content: [] },
        { type: 'message', content: [{ type: 'output_text', text: 'First' }, { type: 'output_text', text: 'Second' }] },
      ],
    })).toBe('First\nSecond');
  });

  it('collects Anthropic text blocks and ignores non-text blocks', () => {
    expect(parseAnthropicText({
      content: [{ type: 'thinking', thinking: 'hidden' }, { type: 'text', text: 'Visible' }],
    })).toBe('Visible');
  });

  it('collects Gemini text parts from candidates', () => {
    expect(parseGeminiText({
      candidates: [{ content: { parts: [{ text: 'Gemini response' }, { inlineData: { data: 'abc' } }] } }],
    })).toBe('Gemini response');
  });

  it('returns an empty string for malformed provider responses', () => {
    expect(parseOpenAIText({})).toBe('');
    expect(parseAnthropicText({})).toBe('');
    expect(parseGeminiText({})).toBe('');
  });
});
