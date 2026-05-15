export interface PredictionResult {
  prediction: string;
  confidence: number;
  filename: string;
  timestamp: string;
  analysisMode?: 'ai' | 'fallback';
  note?: string;
}

export interface HistoryItem {
  id: number;
  filename: string;
  prediction: string;
  confidence: number;
  timestamp: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
