export interface EraOption {
  id: string;
  label: string;
  description: string;
  promptSuffix: string;
  color: string;
  image?: string;
}

export enum AppState {
  CAMERA = 'CAMERA',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR'
}

export interface GenerationResult {
  imageUrl: string | null;
  originalUrl: string | null;
  era: string;
}
