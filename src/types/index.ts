export interface DetectionDetails {
  background_copy: boolean;
  style_copy: boolean;
  direct_copy: boolean;
  partial_copy: boolean;
}

export interface ComparisonResult {
  // Core metrics
  global_similarity: number;
  gram_similarity: number;
  structural_similarity: number;
  color_similarity: number;
  background_score: number;
  
  // Analysis
  high_sim_percentage: number;
  multiscale: Record<string, number>;
  
  // Verdict
  verdict: 'HIGH' | 'MODERATE' | 'LOW';
  verdict_message: string;
  detection_type: 'direct_copy' | 'background_copy' | 'style_copy' | 'partial_copy' | 'none';
  detection_details: DetectionDetails;
  
  // Visualization
  result_image: string;
  
  // Metadata
  model: string;
  model_size: string;
  feedback_enabled: boolean;
}

export interface UploadedImages {
  original: File | null;
  aiImage: File | null;
  originalPreview: string | null;
  aiPreview: string | null;
}

export interface ModelInfo {
  model: string;
  model_size: string;
  embed_dim: number;
  patch_size: number;
  scales: number[];
  features: string[];
  feedback_enabled: boolean;
}

export interface FeedbackSubmission {
  original_image: string;
  ai_image: string;
  feedback_type: 'correct' | 'incorrect' | 'suggestion';
  feedback_text: string;
  comparison_result?: ComparisonResult;
}
