import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ComparisonResult } from '../types';
import { FeedbackModal } from '../components/FeedbackModal';
import { submitFeedback } from '../services/api';
import './ResultPage.css';

interface LocationState {
  result: ComparisonResult;
  originalPreview: string;
  aiPreview: string;
}

export const ResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const [showFeedback, setShowFeedback] = useState(false);

  if (!state) {
    return (
      <div className="result-page">
        <div className="no-result">
          <span className="no-result-icon">📭</span>
          <h2>No Results Found</h2>
          <p>Please go back and upload images to compare</p>
          <button className="back-button" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const { result, originalPreview, aiPreview } = state;

  const getVerdictColor = () => {
    switch (result.verdict) {
      case 'HIGH':
        return '#ef4444';
      case 'MODERATE':
        return '#f59e0b';
      case 'LOW':
        return '#22c55e';
      default:
        return '#fff';
    }
  };

  const getVerdictGlow = () => {
    switch (result.verdict) {
      case 'HIGH':
        return 'rgba(239, 68, 68, 0.4)';
      case 'MODERATE':
        return 'rgba(245, 158, 11, 0.4)';
      case 'LOW':
        return 'rgba(34, 197, 94, 0.4)';
      default:
        return 'transparent';
    }
  };

  const getMetricColor = (value: number) => {
    if (value > 70) return '#ef4444';
    if (value > 40) return '#f59e0b';
    return '#22c55e';
  };

  const getDetectionLabel = () => {
    switch (result.detection_type) {
      case 'direct_copy':
        return { icon: '🚨', label: 'Direct Copy' };
      case 'background_copy':
        return { icon: '🎨', label: 'Background Copy' };
      case 'style_copy':
        return { icon: '🖌️', label: 'Style Copy' };
      case 'partial_copy':
        return { icon: '📍', label: 'Partial Copy' };
      default:
        return null;
    }
  };

  const detection = getDetectionLabel();

  const metrics = [
    { label: 'Global', value: result.global_similarity, icon: '🎯' },
    { label: 'Texture (Gram)', value: result.gram_similarity, icon: '🎨' },
    { label: 'Structural', value: result.structural_similarity, icon: '📐' },
    { label: 'Color', value: result.color_similarity, icon: '🌈' },
    { label: 'Background', value: result.background_score, icon: '🖼️' },
  ];

  const handleFeedbackSubmit = async (feedbackType: string, feedbackText: string, rating: number) => {
    await submitFeedback(
      originalPreview,
      aiPreview,
      feedbackType,
      feedbackText,
      rating,
      result
    );
  };

  return (
    <div className="result-page">
      <div className="result-header">
        <button className="back-button" onClick={() => navigate('/')}>
          <span className="back-icon">←</span>
          <span>Back to Home</span>
        </button>
        <div className="header-info">
          <h1 className="result-title">Comparison Results</h1>
        </div>
        <button className="feedback-btn" onClick={() => setShowFeedback(true)}>
          📝 Feedback
        </button>
      </div>

      <div className="result-content">
        {/* Detection Banner */}
        {detection && (
          <div className="detection-banner" style={{ borderColor: getVerdictColor() }}>
            <span className="detection-icon">{detection.icon}</span>
            <span className="detection-label">{detection.label} Detected</span>
          </div>
        )}

        {/* Score Card */}
        <div 
          className="score-card"
          style={{ 
            '--verdict-color': getVerdictColor(),
            '--verdict-glow': getVerdictGlow()
          } as React.CSSProperties}
        >
          <div className="score-circle">
            <span className="score-value">{result.global_similarity}</span>
            <span className="score-percent">%</span>
          </div>
          <div className="score-info">
            <span className="score-label">Global Similarity</span>
            <span className="verdict-badge">{result.verdict_message}</span>
          </div>
        </div>

        {/* Enhanced Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric) => (
            <div 
              key={metric.label} 
              className="metric-card"
              style={{ '--metric-color': getMetricColor(metric.value) } as React.CSSProperties}
            >
              <span className="metric-icon">{metric.icon}</span>
              <span className="metric-value">{metric.value.toFixed(1)}%</span>
              <span className="metric-label">{metric.label}</span>
              <div className="metric-bar">
                <div 
                  className="metric-bar-fill" 
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Images Preview */}
        <div className="images-preview">
          <div className="preview-card">
            <div className="preview-label">1st Image</div>
            <img src={originalPreview} alt="Original" className="preview-img" />
          </div>
          <div className="preview-card">
            <div className="preview-label">2nd Image</div>
            <img src={aiPreview} alt="AI Generated" className="preview-img" />
          </div>
        </div>

        {/* Multi-scale Analysis */}
        {result.multiscale && Object.keys(result.multiscale).length > 0 && (
          <div className="multiscale-section">
            <h2 className="section-title">
              <span className="section-icon">📊</span>
              Multi-Scale Analysis
            </h2>
            <div className="scale-bars">
              {Object.entries(result.multiscale)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([scale, value]) => (
                  <div key={scale} className="scale-item">
                    <span className="scale-label">{scale}px</span>
                    <div className="scale-bar">
                      <div 
                        className="scale-bar-fill" 
                        style={{ 
                          width: `${value}%`,
                          backgroundColor: getMetricColor(value)
                        }}
                      />
                    </div>
                    <span className="scale-value">{value.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-value">{result.high_sim_percentage}%</span>
            <span className="stat-label">High Similarity Regions</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value" style={{ color: getVerdictColor() }}>
              {result.verdict}
            </span>
            <span className="stat-label">Risk Level</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">{result.background_score.toFixed(1)}%</span>
            <span className="stat-label">Background Score</span>
          </div>
        </div>

        {/* Heatmap Result */}
        <div className="heatmap-section">
          <h2 className="section-title">
            <span className="section-icon">🗺️</span>
            Detailed Heatmap Analysis
          </h2>
          <div className="heatmap-container">
            <img 
              src={`data:image/png;base64,${result.result_image}`} 
              alt="Comparison Heatmap" 
              className="heatmap-image"
            />
          </div>
          <div className="heatmap-legend">
            <div className="legend-item">
              <span className="legend-color high"></span>
              <span>High Similarity (Red)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color medium"></span>
              <span>Medium Similarity (Yellow)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color low"></span>
              <span>Low Similarity (Green)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
};
