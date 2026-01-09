import type { ComparisonResult } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function compareImages(original: File, aiImage: File): Promise<ComparisonResult> {
  const formData = new FormData();
  formData.append('original', original);
  formData.append('ai_image', aiImage);

  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Comparison failed');
  }

  return response.json();
}

export async function submitFeedback(
  originalImage: string,
  aiImage: string,
  feedbackType: string,
  feedbackText: string,
  rating: number,
  comparisonResult?: ComparisonResult
): Promise<{ success: boolean; message: string; feedback_id?: string }> {
  const response = await fetch(`${API_BASE_URL}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      original_image: originalImage,
      ai_image: aiImage,
      feedback_type: feedbackType,
      feedback_text: feedbackText,
      rating: rating,
      comparison_result: comparisonResult,
    }),
  });

  return response.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
