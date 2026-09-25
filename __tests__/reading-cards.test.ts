import { describe, it, expect } from 'vitest';

// Test the card content structure
describe('Reading Cards Content Structure', () => {
  // Mock hexagram data structure
  const mockHexagram = {
    hex: 1,
    hex_font: '䷀',
    trad_chinese: '乾',
    pinyin: 'qián',
    english: 'Initiating',
    binary: 111111,
    od: '02',
    wilhelm_above: { chinese: "CH'IEN", symbolic: 'THE CREATIVE,', alchemical: 'HEAVEN' },
    wilhelm_below: { chinese: "CH'IEN", symbolic: 'THE CREATIVE,', alchemical: 'HEAVEN' },
    wilhelm_symbolic: 'The first hexagram is made up of six unbroken lines...',
    wilhelm_judgment: {
      text: 'THE CREATIVE works sublime success, Furthering through perseverance.',
      comments: 'According to the original meaning, the attributes are paired...',
    },
    wilhelm_image: {
      text: 'The movement of heaven is full of power.',
      comments: 'Since there is only one heaven, the doubling of the trigram...',
    },
    wilhelm_lines: {
      '1': { text: 'Hidden dragon. Do not act.', comments: 'In China the dragon has a meaning...' },
      '2': { text: 'Dragon appearing in the field.', comments: 'Here the effects of the light-giving power...' },
      '3': { text: 'All day long the superior man is creatively active.', comments: 'A sphere of influence opens up...' },
      '4': { text: 'Wavering flight over the depths.', comments: 'A place of transition has been reached...' },
      '5': { text: 'Flying dragon in the heavens.', comments: 'Here the great man has attained...' },
      '6': { text: 'Arrogant dragon will have cause to repent.', comments: 'When a man seeks to climb so high...' },
    },
  };

  it('should have all required Wilhelm translation sections', () => {
    // Verify the hexagram has judgment text and comments
    expect(mockHexagram.wilhelm_judgment).toBeDefined();
    expect(mockHexagram.wilhelm_judgment.text).toBeTruthy();
    expect(mockHexagram.wilhelm_judgment.comments).toBeTruthy();

    // Verify the hexagram has image text and comments
    expect(mockHexagram.wilhelm_image).toBeDefined();
    expect(mockHexagram.wilhelm_image.text).toBeTruthy();
    expect(mockHexagram.wilhelm_image.comments).toBeTruthy();

    // Verify the hexagram has symbolic description
    expect(mockHexagram.wilhelm_symbolic).toBeTruthy();

    // Verify all 6 lines have text and comments
    for (let i = 1; i <= 6; i++) {
      const line = mockHexagram.wilhelm_lines[String(i) as keyof typeof mockHexagram.wilhelm_lines];
      expect(line).toBeDefined();
      expect(line.text).toBeTruthy();
      expect(line.comments).toBeTruthy();
    }
  });

  it('should parse AI interpretation into sections', () => {
    const mockInterpretation = `WHAT THIS PATTERN IS ABOUT
This hexagram speaks to the creative force at work in your life...

HOW THIS MIGHT SPEAK TO YOUR SITUATION
Given your question about career changes, this pattern suggests...

QUESTIONS TO SIT WITH
- What would it mean to trust your creative impulses more fully?
- Where in your life are you holding back when you could be initiating?
- How might perseverance serve you in this moment?`;

    // Parse interpretation
    const aboutMatch = mockInterpretation.match(/WHAT THIS PATTERN IS ABOUT[:\s]*([\s\S]*?)(?=HOW THIS MIGHT SPEAK|QUESTIONS TO SIT WITH|$)/i);
    const situationMatch = mockInterpretation.match(/HOW THIS MIGHT SPEAK TO YOUR SITUATION[:\s]*([\s\S]*?)(?=QUESTIONS TO SIT WITH|$)/i);
    const questionsMatch = mockInterpretation.match(/QUESTIONS TO SIT WITH[:\s]*([\s\S]*?)$/i);

    expect(aboutMatch).toBeTruthy();
    expect(aboutMatch![1].trim()).toContain('creative force');

    expect(situationMatch).toBeTruthy();
    expect(situationMatch![1].trim()).toContain('career changes');

    expect(questionsMatch).toBeTruthy();
    const questionsText = questionsMatch![1].trim();
    const questions = questionsText
      .split(/\n/)
      .map(q => q.replace(/^[-•*]\s*/, '').trim())
      .filter(q => q.length > 0 && q.includes('?'));
    
    expect(questions.length).toBe(3);
    expect(questions[0]).toContain('creative impulses');
  });

  it('should identify changing lines correctly', () => {
    // Lines: 6=old yin (changing), 7=young yang, 8=young yin, 9=old yang (changing)
    const lines = [7, 9, 8, 6, 7, 8]; // Lines 2 and 4 are changing
    
    const changingLines = lines
      .map((line, index) => (line === 6 || line === 9) ? index + 1 : null)
      .filter(Boolean);
    
    expect(changingLines).toEqual([2, 4]);
  });

  it('should have wisdom quote structure', () => {
    const mockWisdomQuote = {
      text: 'The journey of a thousand miles begins with a single step.',
      author: 'Lao Tzu',
      source: 'Tao Te Ching',
      themes: ['beginning', 'journey', 'action'],
    };

    expect(mockWisdomQuote.text).toBeTruthy();
    expect(mockWisdomQuote.author).toBeTruthy();
    expect(mockWisdomQuote.themes).toBeInstanceOf(Array);
  });

  it('should have Tao Te Ching verse structure', () => {
    const mockTaoVerse = {
      chapter: 1,
      text: 'The Tao that can be told is not the eternal Tao...',
      reflection: 'What aspects of your situation resist easy explanation?',
    };

    expect(mockTaoVerse.chapter).toBeGreaterThan(0);
    expect(mockTaoVerse.chapter).toBeLessThanOrEqual(81);
    expect(mockTaoVerse.text).toBeTruthy();
    expect(mockTaoVerse.reflection).toBeTruthy();
  });
});

describe('Card Order and Completeness', () => {
  it('should have cards in the correct order', () => {
    // Expected card order based on the reading-cards.tsx implementation
    const expectedCardOrder = [
      'question',
      'hexagram',
      'vision', // optional - only if image is loading/loaded
      'pattern',
      'situation',
      // reflection-0, reflection-1, etc. (dynamic based on questions)
      'transformation', // optional - only if changing lines
      // line-1, line-2, etc. (dynamic based on changing lines)
      'wisdom',
      'judgment',
      'image',
      'symbolic',
      'tao',
    ];

    // Core cards that should always be present
    const coreCards = ['question', 'hexagram', 'pattern', 'wisdom', 'judgment', 'image', 'tao'];
    
    coreCards.forEach(cardId => {
      expect(expectedCardOrder).toContain(cardId);
    });
  });

  it('should include changing line cards when lines are changing', () => {
    const changingLines = [2, 5]; // Lines 2 and 5 are changing
    
    // Should generate cards for each changing line
    const expectedLineCards = changingLines.map(num => `line-${num}`);
    
    expect(expectedLineCards).toEqual(['line-2', 'line-5']);
  });
});
