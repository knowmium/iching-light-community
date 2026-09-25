export type ProviderJson = Record<string, unknown>;

export function parseOpenAIText(data: ProviderJson): string {
  const output = Array.isArray(data.output) ? data.output : [];
  const parts = output.flatMap((item) => {
    if (!item || typeof item !== 'object') return [];
    const content = (item as { content?: unknown }).content;
    return Array.isArray(content) ? content : [];
  });

  return parts
    .filter((part) => part && typeof part === 'object' && (part as { type?: string }).type === 'output_text')
    .map((part) => (part as { text?: string }).text ?? '')
    .join('\n')
    .trim();
}

export function parseAnthropicText(data: ProviderJson): string {
  const content = Array.isArray(data.content) ? data.content : [];
  return content
    .filter((part) => part && typeof part === 'object' && (part as { type?: string }).type === 'text')
    .map((part) => (part as { text?: string }).text ?? '')
    .join('\n')
    .trim();
}

export function parseGeminiText(data: ProviderJson): string {
  const candidates = Array.isArray(data.candidates) ? data.candidates : [];
  return candidates
    .flatMap((candidate) => {
      if (!candidate || typeof candidate !== 'object') return [];
      const content = (candidate as { content?: { parts?: unknown } }).content;
      return Array.isArray(content?.parts) ? content.parts : [];
    })
    .filter((part) => part && typeof part === 'object' && typeof (part as { text?: unknown }).text === 'string')
    .map((part) => (part as { text: string }).text)
    .join('\n')
    .trim();
}
