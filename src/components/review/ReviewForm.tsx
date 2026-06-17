import { useState, type FormEvent } from 'react';
import { useDispatch } from 'react-redux';
import { addReviewAsync } from '../../store/slices/reviewSlice';
import { useAuth } from '../../hooks/useAuth';
import StarRating from './StarRating';
import toast from 'react-hot-toast';
import type { Review } from '../../types';
import { HiStar } from 'react-icons/hi';
import type { AppDispatch } from '../../store';
import styles from './ReviewForm.module.css';

interface ReviewFormProps {
    venueId: string;
    onReviewAdded?: (review: Review) => void;
}

export default function ReviewForm({ venueId, onReviewAdded }: ReviewFormProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }
        if (comment.trim().length < 10) {
            toast.error('Review must be at least 10 characters');
            return;
        }
        if (!user) return;

        const review: Review = {
            id: `review_${Date.now()}`,
            userId: user.id,
            userName: user.name,
            venueId,
            rating,
            comment: comment.trim(),
            createdAt: new Date().toISOString(),
        };

        dispatch(addReviewAsync(review));
        toast.success(
            <div className={styles.toastContent}>
                <span>Review submitted!</span>
                <HiStar className={styles.toastIcon} />
            </div>
        );
        setRating(0);
        setComment('');
        onReviewAdded?.(review);
    }

    return (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h3 className={styles.title}>Leave a Review</h3>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Rating</label>
                <StarRating value={rating} onChange={setRating} size="lg" />
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="review-comment" className={styles.label}>
                    Your Review
                </label>
                <textarea
                    id="review-comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    rows={3}
                    className={styles.textarea}
                />
            </div>

            <button type="submit" className={styles.submitBtn}>
                Submit Review
            </button>
        </form>
    );
}
