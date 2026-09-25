export interface WilhelmTrigram {
  chinese: string;
  symbolic: string;
  alchemical: string;
}

export interface WilhelmJudgment {
  text: string;
  comments: string;
}

export interface WilhelmImage {
  text: string;
  comments: string;
}

export interface WilhelmLine {
  text: string;
  comments: string;
}

export interface Hexagram {
  hex: number;
  hex_font: string;
  trad_chinese: string;
  pinyin: string;
  english: string;
  binary: number | string;
  od: string | number;
  wilhelm_above: WilhelmTrigram;
  wilhelm_below: WilhelmTrigram;
  wilhelm_symbolic: string;
  wilhelm_judgment: WilhelmJudgment;
  wilhelm_image: WilhelmImage;
  wilhelm_lines: Record<string, WilhelmLine>;
}

export type IChingData = Record<string, Hexagram>;

export interface Reading {
  id: string;
  hexagramNumber: number;
  date: string;
  lines: number[]; // Array of 6 values: 6=old yin, 7=young yang, 8=young yin, 9=old yang
  question?: string; // The seeker's question or situation
  imageUrl?: string; // Cached URL of the generated vision image
  interpretation?: string; // Cached AI interpretation
  synthesis?: string; // Cached AI synthesis
}
