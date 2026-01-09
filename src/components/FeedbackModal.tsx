import React, { useState } from 'react';
import './FeedbackModal.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedbackType: string, feedbackText: string, rating: number) => Promise<void>;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!feedbackType) {
      setError('Please select a feedback type');
      return;
    }
    if (rating === 0) {
      setError('Please provide a rating');
      return;
    }
    if (!feedbackText.trim()) {
      setError('Please provide feedback details');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(feedbackType, feedbackText, rating);
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFeedbackType('');
        setFeedbackText('');
        setRating(0);
      }, 2000);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackOptions = [
    { value: 'correct', label: '✅ Result is correct', icon: '✅' },
    { value: 'incorrect', label: '❌ Result is incorrect', icon: '❌' },
    { value: 'suggestion', label: '💡 Suggestion for improvement', icon: '💡' },
  ];

  const renderStars = () => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </button>
        ))}
        <span className="rating-text">
          {rating > 0 ? `${rating}/5` : 'Select rating'}
        </span>
      </div>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {submitted ? (
          <div className="feedback-success">
            <span className="success-icon">✨</span>
            <h3>Thank you!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        ) : (
          <>
            <div className="modal-header">
              <h2>📝 Submit Feedback</h2>
              <button className="close-btn" onClick={onClose}>×</button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Help us improve our AI detection by providing feedback on this result.
              </p>

              <div className="feedback-types">
                {feedbackOptions.map(option => (
                  <button
                    key={option.value}
                    className={`feedback-type-btn ${feedbackType === option.value ? 'selected' : ''}`}
                    onClick={() => setFeedbackType(option.value)}
                  >
                    <span className="type-icon">{option.icon}</span>
                    <span className="type-label">{option.label.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>

              <div className="rating-section">
                <label>How accurate was the result?</label>
                {renderStars()}
              </div>

              <div className="feedback-input">
                <label htmlFor="feedbackText">Details</label>
                <textarea
                  id="feedbackText"
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Please describe the issue or suggestion in detail..."
                  rows={4}
                />
              </div>

              {error && <div className="feedback-error">{error}</div>}
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </button>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
