
export interface Source {
  title: string;
  url: string;
  authors?: string;
  journal?: string;
  summary?: string;
  evidence?: string;
}

export interface AnalysisData {
  summary: string;
  accuracy: 'accurate' | 'partially-accurate' | 'inaccurate';
  confidence: number;
  sources: Source[];
}

export interface Analysis {
  id: string;
  originalText: string;
  overallAccuracy: string;
  timestamp: string;
  summary: string;
  accuracy: 'accurate' | 'partially-accurate' | 'inaccurate';
  confidence: number;
  sources: Source[];
}
