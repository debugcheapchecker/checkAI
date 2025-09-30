export interface RevisionSuggestion {
  suspicious_passage: string;
  suggestion: string;
  rewritten_example: string;
}

export interface AnalysisReportData {
  conclusion: string;
  ai_detection_percentage: number;
  key_evidence: string[];
  revision_suggestions: RevisionSuggestion[];
}

export interface AnalysisResult {
  id: string;
  originalText: string;
  report: AnalysisReportData | null;
  rewrittenText?: string;
  error?: string;
}