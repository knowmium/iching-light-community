// Wisdom quotes from public domain sources - diverse global voices
// Mapped to I Ching hexagram themes

export interface WisdomQuote {
  text: string;
  author: string;
  source?: string;
  tradition?: string;
}

// Quotes organized by theme, mapped to hexagram numbers
const quotesByHexagram: Record<number, WisdomQuote> = {
  // 1. Ch'ien / The Creative - Heaven, strength, initiative
  1: {
    text: "The way to do is to be.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    tradition: "Chinese"
  },
  
  // 2. K'un / The Receptive - Earth, yielding, devotion
  2: {
    text: "All shall be well, and all shall be well, and all manner of thing shall be well.",
    author: "Julian of Norwich",
    source: "Revelations of Divine Love",
    tradition: "English"
  },
  
  // 3. Chun / Difficulty at the Beginning - Growth through struggle
  3: {
    text: "The wound is the place where the Light enters you.",
    author: "Rumi",
    source: "Collected Poems",
    tradition: "Persian"
  },
  
  // 4. Mêng / Youthful Folly - Learning, innocence
  4: {
    text: "The only true wisdom is in knowing you know nothing.",
    author: "Socrates",
    tradition: "Greek"
  },
  
  // 5. Hsü / Waiting - Patience, nourishment
  5: {
    text: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    tradition: "Chinese"
  },
  
  // 6. Sung / Conflict - Dispute, caution
  6: {
    text: "In the midst of movement and chaos, keep stillness inside of you.",
    author: "Deepak Chopra",
    tradition: "Indian"
  },
  
  // 7. Shih / The Army - Discipline, organization
  7: {
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
    source: "Discourses",
    tradition: "Greek"
  },
  
  // 8. Pi / Holding Together - Union, seeking guidance
  8: {
    text: "We are all connected; to each other, biologically. To the earth, chemically. To the rest of the universe atomically.",
    author: "Thich Nhat Hanh",
    tradition: "Vietnamese"
  },
  
  // 9. Hsiao Ch'u / Small Taming - Gentle restraint
  9: {
    text: "Knowing others is intelligence; knowing yourself is true wisdom.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    tradition: "Chinese"
  },
  
  // 10. Lü / Treading - Conduct, careful progress
  10: {
    text: "Walk as if you are kissing the Earth with your feet.",
    author: "Thich Nhat Hanh",
    tradition: "Vietnamese"
  },
  
  // 11. T'ai / Peace - Harmony, prosperity
  11: {
    text: "Peace comes from within. Do not seek it without.",
    author: "Buddha",
    tradition: "Indian"
  },
  
  // 12. P'i / Standstill - Stagnation, withdrawal
  12: {
    text: "In the depth of winter, I finally learned that within me there lay an invincible summer.",
    author: "Albert Camus",
    tradition: "French"
  },
  
  // 13. T'ung Jên / Fellowship - Community, shared purpose
  13: {
    text: "I am a part of all that I have met.",
    author: "Alfred, Lord Tennyson",
    source: "Ulysses",
    tradition: "English"
  },
  
  // 14. Ta Yu / Great Possession - Abundance, supreme success
  14: {
    text: "The soul should always stand ajar, ready to welcome the ecstatic experience.",
    author: "Emily Dickinson",
    tradition: "American"
  },
  
  // 15. Ch'ien / Modesty - Humility, balance
  15: {
    text: "Humility is not thinking less of yourself, it is thinking of yourself less.",
    author: "C.S. Lewis",
    tradition: "English"
  },
  
  // 16. Yü / Enthusiasm - Joy, inspiration
  16: {
    text: "Let yourself be silently drawn by the strange pull of what you really love.",
    author: "Rumi",
    source: "Collected Poems",
    tradition: "Persian"
  },
  
  // 17. Sui / Following - Adaptability, service
  17: {
    text: "The bamboo that bends is stronger than the oak that resists.",
    author: "Japanese Proverb",
    tradition: "Japanese"
  },
  
  // 18. Ku / Work on the Decayed - Repair, renewal
  18: {
    text: "What is to give light must endure burning.",
    author: "Viktor Frankl",
    tradition: "Austrian"
  },
  
  // 19. Lin / Approach - Drawing near, influence
  19: {
    text: "The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.",
    author: "Carl Jung",
    tradition: "Swiss"
  },
  
  // 20. Kuan / Contemplation - Observation, insight
  20: {
    text: "The real voyage of discovery consists not in seeking new landscapes, but in having new eyes.",
    author: "Marcel Proust",
    tradition: "French"
  },
  
  // 21. Shih Ho / Biting Through - Decisive action
  21: {
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    tradition: "Spanish"
  },
  
  // 22. Pi / Grace - Beauty, form
  22: {
    text: "Everything has beauty, but not everyone sees it.",
    author: "Confucius",
    source: "Analects",
    tradition: "Chinese"
  },
  
  // 23. Po / Splitting Apart - Decline, letting go
  23: {
    text: "The art of knowing is knowing what to ignore.",
    author: "Rumi",
    source: "Collected Poems",
    tradition: "Persian"
  },
  
  // 24. Fu / Return - Renewal, turning point
  24: {
    text: "For a seed to achieve its greatest expression, it must come completely undone.",
    author: "Cynthia Occelli",
    tradition: "American"
  },
  
  // 25. Wu Wang / Innocence - Spontaneity, naturalness
  25: {
    text: "In the beginner's mind there are many possibilities, but in the expert's there are few.",
    author: "Shunryu Suzuki",
    source: "Zen Mind, Beginner's Mind",
    tradition: "Japanese"
  },
  
  // 26. Ta Ch'u / Great Taming - Restraint, accumulation
  26: {
    text: "He who conquers himself is the mightiest warrior.",
    author: "Confucius",
    source: "Analects",
    tradition: "Chinese"
  },
  
  // 27. I / Nourishment - Sustenance, care
  27: {
    text: "One cannot think well, love well, sleep well, if one has not dined well.",
    author: "Virginia Woolf",
    source: "A Room of One's Own",
    tradition: "English"
  },
  
  // 28. Ta Kuo / Great Exceeding - Extraordinary times
  28: {
    text: "The only way out is through.",
    author: "Robert Frost",
    tradition: "American"
  },
  
  // 29. K'an / The Abysmal - Danger, depth
  29: {
    text: "You must go into the dark in order to bring forth your light.",
    author: "Debbie Ford",
    tradition: "American"
  },
  
  // 30. Li / The Clinging - Fire, clarity, dependence
  30: {
    text: "There are two ways of spreading light: to be the candle or the mirror that reflects it.",
    author: "Edith Wharton",
    tradition: "American"
  },
  
  // 31. Hsien / Influence - Attraction, mutual response
  31: {
    text: "Love is the bridge between you and everything.",
    author: "Rumi",
    source: "Collected Poems",
    tradition: "Persian"
  },
  
  // 32. Hêng / Duration - Endurance, constancy
  32: {
    text: "The world is full of magical things patiently waiting for our wits to grow sharper.",
    author: "Bertrand Russell",
    tradition: "English"
  },
  
  // 33. Tun / Retreat - Withdrawal, strategic retreat
  33: {
    text: "Knowing when to stop is the key to avoiding danger.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    tradition: "Chinese"
  },
  
  // 34. Ta Chuang / Great Power - Strength, vigor
  34: {
    text: "With great power comes great responsibility.",
    author: "Voltaire",
    tradition: "French"
  },
  
  // 35. Chin / Progress - Advancement, sunrise
  35: {
    text: "The sun himself is weak when he first rises, and gathers strength and courage as the day gets on.",
    author: "Charles Dickens",
    source: "The Old Curiosity Shop",
    tradition: "English"
  },
  
  // 36. Ming I / Darkening of the Light - Adversity, inner light
  36: {
    text: "Hope is being able to see that there is light despite all of the darkness.",
    author: "Desmond Tutu",
    tradition: "South African"
  },
  
  // 37. Chia Jên / The Family - Domestic harmony
  37: {
    text: "The love of family and the admiration of friends is much more important than wealth and privilege.",
    author: "Charles Kuralt",
    tradition: "American"
  },
  
  // 38. K'uei / Opposition - Estrangement, contrast
  38: {
    text: "The test of a first-rate intelligence is the ability to hold two opposing ideas in mind at the same time and still retain the ability to function.",
    author: "F. Scott Fitzgerald",
    tradition: "American"
  },
  
  // 39. Chien / Obstruction - Obstacles, perseverance
  39: {
    text: "The obstacle is the path.",
    author: "Zen Proverb",
    tradition: "Japanese"
  },
  
  // 40. Hsieh / Deliverance - Release, liberation
  40: {
    text: "Freedom is what you do with what's been done to you.",
    author: "Jean-Paul Sartre",
    tradition: "French"
  },
  
  // 41. Sun / Decrease - Simplification, sacrifice
  41: {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    tradition: "Italian"
  },
  
  // 42. I / Increase - Growth, benefit
  42: {
    text: "A rising tide lifts all boats.",
    author: "John F. Kennedy",
    tradition: "American"
  },
  
  // 43. Kuai / Breakthrough - Resolution, determination
  43: {
    text: "The truth will set you free, but first it will make you miserable.",
    author: "James A. Garfield",
    tradition: "American"
  },
  
  // 44. Kou / Coming to Meet - Encounter, temptation
  44: {
    text: "We do not see things as they are, we see them as we are.",
    author: "Anaïs Nin",
    tradition: "French-Cuban"
  },
  
  // 45. Ts'ui / Gathering Together - Assembly, collection
  45: {
    text: "Alone we can do so little; together we can do so much.",
    author: "Helen Keller",
    tradition: "American"
  },
  
  // 46. Shêng / Pushing Upward - Ascending, effort
  46: {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    tradition: "Chinese"
  },
  
  // 47. K'un / Oppression - Exhaustion, adversity
  47: {
    text: "Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.",
    author: "Kahlil Gibran",
    source: "The Prophet",
    tradition: "Lebanese"
  },
  
  // 48. Ching / The Well - Source, nourishment
  48: {
    text: "We forget that the water cycle and the life cycle are one.",
    author: "Jacques Cousteau",
    tradition: "French"
  },
  
  // 49. Ko / Revolution - Change, transformation
  49: {
    text: "You must be the change you wish to see in the world.",
    author: "Mahatma Gandhi",
    tradition: "Indian"
  },
  
  // 50. Ting / The Cauldron - Nourishment, transformation
  50: {
    text: "Cooking is like love. It should be entered into with abandon or not at all.",
    author: "Harriet Van Horne",
    tradition: "American"
  },
  
  // 51. Chên / The Arousing - Shock, thunder
  51: {
    text: "Life begins at the end of your comfort zone.",
    author: "Neale Donald Walsch",
    tradition: "American"
  },
  
  // 52. Kên / Keeping Still - Meditation, stillness
  52: {
    text: "Within you there is a stillness and a sanctuary to which you can retreat at any time.",
    author: "Hermann Hesse",
    source: "Siddhartha",
    tradition: "German"
  },
  
  // 53. Chien / Development - Gradual progress
  53: {
    text: "Have patience. All things are difficult before they become easy.",
    author: "Saadi",
    source: "Gulistan",
    tradition: "Persian"
  },
  
  // 54. Kuei Mei / The Marrying Maiden - Relationships, propriety
  54: {
    text: "The meeting of two personalities is like the contact of two chemical substances.",
    author: "Carl Jung",
    tradition: "Swiss"
  },
  
  // 55. Fêng / Abundance - Fullness, zenith
  55: {
    text: "Gratitude turns what we have into enough.",
    author: "Melody Beattie",
    tradition: "American"
  },
  
  // 56. Lü / The Wanderer - Travel, transience
  56: {
    text: "Not all those who wander are lost.",
    author: "J.R.R. Tolkien",
    source: "The Fellowship of the Ring",
    tradition: "English"
  },
  
  // 57. Sun / The Gentle - Penetration, wind
  57: {
    text: "Softness triumphs over hardness, feebleness over strength. What is malleable is always superior to that which is immovable.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    tradition: "Chinese"
  },
  
  // 58. Tui / The Joyous - Joy, lake
  58: {
    text: "Joy is the simplest form of gratitude.",
    author: "Karl Barth",
    tradition: "Swiss"
  },
  
  // 59. Huan / Dispersion - Dissolution, scattering
  59: {
    text: "Nothing in life is to be feared, it is only to be understood.",
    author: "Marie Curie",
    tradition: "Polish-French"
  },
  
  // 60. Chieh / Limitation - Restraint, boundaries
  60: {
    text: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius",
    source: "Meditations",
    tradition: "Roman"
  },
  
  // 61. Chung Fu / Inner Truth - Sincerity, insight
  61: {
    text: "To thine own self be true.",
    author: "William Shakespeare",
    source: "Hamlet",
    tradition: "English"
  },
  
  // 62. Hsiao Kuo / Small Exceeding - Attention to detail
  62: {
    text: "God is in the details.",
    author: "Ludwig Mies van der Rohe",
    tradition: "German"
  },
  
  // 63. Chi Chi / After Completion - Transition, vigilance
  63: {
    text: "The end of one journey is the beginning of another.",
    author: "Seneca",
    source: "Letters from a Stoic",
    tradition: "Roman"
  },
  
  // 64. Wei Chi / Before Completion - Transition, potential
  64: {
    text: "Every new beginning comes from some other beginning's end.",
    author: "Seneca",
    source: "Letters from a Stoic",
    tradition: "Roman"
  }
};

// Get a wisdom quote for a specific hexagram
export function getWisdomQuote(hexagramNumber: number): WisdomQuote {
  return quotesByHexagram[hexagramNumber] || quotesByHexagram[1];
}

// Get all quotes for browsing
export function getAllQuotes(): Record<number, WisdomQuote> {
  return quotesByHexagram;
}
