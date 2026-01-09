import React, { useCallback } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  title: string;
  subtitle: string;
  icon: string;
  preview: string | null;
  onImageSelect: (file: File, preview: string) => void;
  accentColor: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  title,
  subtitle,
  icon,
  preview,
  onImageSelect,
  accentColor,
}) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(file, reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className="image-uploader"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{ '--accent-color': accentColor } as React.CSSProperties}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        id={`upload-${title.toLowerCase().replace(/\s/g, '-')}`}
        className="file-input"
      />
      <label
        htmlFor={`upload-${title.toLowerCase().replace(/\s/g, '-')}`}
        className="upload-label"
      >
        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <div className="preview-overlay">
              <span className="change-text">Click to change</span>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon">{icon}</span>
            <span className="upload-title">{title}</span>
            <span className="upload-subtitle">{subtitle}</span>
            <span className="upload-hint">Drag & drop or click to upload</span>
          </div>
        )}
      </label>
    </div>
  );
};
