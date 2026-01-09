import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageUploader } from '../components/ImageUploader';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { compareImages } from '../services/api';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [original, setOriginal] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<File | null>(null);
  const [aiPreview, setAiPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOriginalSelect = (file: File, preview: string) => {
    setOriginal(file);
    setOriginalPreview(preview);
    setError(null);
  };

  const handleAiSelect = (file: File, preview: string) => {
    setAiImage(file);
    setAiPreview(preview);
    setError(null);
  };

  const handleCompare = async () => {
    if (!original || !aiImage) {
      setError('Please upload both images before comparing');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await compareImages(original, aiImage);
      navigate('/result', { 
        state: { 
          result,
          originalPreview,
          aiPreview
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const canCompare = original && aiImage;

  return (
    <div className="home-page">
      {isLoading && <LoadingSpinner message="Analyzing images..." />}

      <div className="hero-section">
        <div className="hero-glow"></div>
        <h1 className="hero-title">
          <span className="gradient-text">Optique</span>
        </h1>
        <p className="hero-subtitle">
          Advanced Image Similarity Detector • Compare & Detect AI-Generated Content
        </p>
      </div>

      <div className="upload-section">
        <ImageUploader
          title="1st Image"
          subtitle="Upload the reference image"
          icon="🖼️"
          preview={originalPreview}
          onImageSelect={handleOriginalSelect}
          accentColor="#a855f7"
        />
        
        <div className="vs-divider">
          <span className="vs-text">VS</span>
        </div>
        
        <ImageUploader
          title="2nd Image"
          subtitle="Upload the image to compare"
          icon="🖼️"
          preview={aiPreview}
          onImageSelect={handleAiSelect}
          accentColor="#ec4899"
        />
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <button 
        className={`compare-button ${canCompare ? 'active' : ''}`}
        onClick={handleCompare}
        disabled={!canCompare || isLoading}
      >
        <span className="button-icon">🔍</span>
        <span className="button-text">Compare Images</span>
        <span className="button-shine"></span>
      </button>

      <div className="features-section">
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Global Similarity</h3>
          <p>Get an overall similarity score between images</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🗺️</span>
          <h3>Heatmap Analysis</h3>
          <p>Visualize which regions are similar or copied</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>Precise Detection</h3>
          <p>Identify specific copied elements with AI</p>
        </div>
      </div>
    </div>
  );
};
