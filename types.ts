export enum SpeakerType {
  FOUNDER = 'FOUNDER',
  INVESTOR = 'INVESTOR'
}

export interface TranslationResult {
  original: string;
  translation: string;
  bsScore: number; // 0 to 100
  toneAnalysis: string;
  wittyComment: string;
}

export interface HistoryItem extends TranslationResult {
  id: string;
  type: SpeakerType;
  timestamp: number;
}