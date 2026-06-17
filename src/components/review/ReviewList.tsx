import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import StarRating from './StarRating';
import EmptyState from '../shared/EmptyState';
import type { Review } from '../../types';
import styles from './ReviewList.module.css';

dayjs.extend(relativeTime);

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (!reviews || reviews.length === 0) {
        return <EmptyState title="No reviews yet" description="Be the first to review this court!" />;
    }

    return (
        <div className={styles.listContainer}>
            {reviews.map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                {review.userName.charAt(0)}
                            </div>
                            <div>
                                <div className={styles.userName}>{review.userName}</div>
                                <div className={styles.timeAgo}>{dayjs(review.createdAt).fromNow()}</div>
                            </div>
                        </div>
                        <StarRating value={review.rating} readonly size="sm" />
                    </div>
                    <p className={styles.comment}>{review.comment}</p>
                </div>
            ))}
        </div>
    );
}
