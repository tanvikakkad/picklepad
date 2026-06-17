import { useState } from 'react';
import { HiStar } from 'react-icons/hi';
import styles from './StarRating.module.css';

interface StarRatingProps {
    value?: number;
    onChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function StarRating({ value = 0, onChange, readonly = false, size = 'md' }: StarRatingProps) {
    const [hovered, setHovered] = useState(0);

    const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

    return (
        <div className={styles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => onChange?.(star)}
                    onMouseEnter={() => !readonly && setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className={`${styles.starBtn} ${sizeClass} ${readonly ? styles.starBtnReadonly : styles.starBtnInteractive}`}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                    <HiStar
                        className={(hovered || value) >= star ? styles.starIconActive : styles.starIconInactive}
                    />
                </button>
            ))}
        </div>
    );
}
