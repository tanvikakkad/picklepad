import { HiTrendingUp, HiTrendingDown, HiLightningBolt } from 'react-icons/hi';
import type { ReactNode } from 'react';
import styles from './PricingSuggestionCard.module.css';

export interface Suggestion {
    id: string;
    type: string;
    reason: string;
    currentPrice: number;
    suggestedPrice: number;
    changePercent?: number;
    slot?: string;
    estimatedImpact?: string;
}

interface PricingSuggestionCardProps {
    suggestion: Suggestion;
    onApply: (suggestion: Suggestion) => void;
    onDismiss: (id: string) => void;
}

export default function PricingSuggestionCard({ suggestion, onApply, onDismiss }: PricingSuggestionCardProps) {
    const isIncrease = (suggestion.changePercent ?? 0) > 0;

    const typeConfig: Record<string, { colorClass: string; icon: ReactNode; label: string }> = {
        increase: { colorClass: styles.typeIconEmerald, icon: <HiTrendingUp />, label: 'Price Increase' },
        decrease: { colorClass: styles.typeIconAmber, icon: <HiTrendingDown />, label: 'Price Decrease' },
        weekend: { colorClass: styles.typeIconBlue, icon: <HiLightningBolt />, label: 'Weekend Surcharge' },
        promo: { colorClass: styles.typeIconPurple, icon: <HiTrendingDown />, label: 'Promotional Discount' },
    };

    const config = typeConfig[suggestion.type] || typeConfig.increase;

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.typeLabel}>
                    <span className={`${styles.typeIcon} ${config.colorClass}`}>
                        {config.icon}
                    </span>
                    <span className={styles.typeText}>{config.label}</span>
                </div>
                <span className={`${styles.badge} ${isIncrease ? styles.badgeIncrease : styles.badgeDecrease}`}>
                    {isIncrease ? '+' : ''}{suggestion.changePercent}%
                </span>
            </div>

            <div className={styles.content}>
                {suggestion.slot && (
                    <div className={styles.slot}>Slot: {suggestion.slot}</div>
                )}
                <p className={styles.reason}>{suggestion.reason}</p>
            </div>

            <div className={styles.priceContainer}>
                <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>Current</span>
                    <div className={styles.currentPrice}>₹{suggestion.currentPrice}</div>
                </div>
                <span className={styles.arrow}>→</span>
                <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>Suggested</span>
                    <div className={styles.suggestedPrice}>₹{suggestion.suggestedPrice}</div>
                </div>
            </div>

            {suggestion.estimatedImpact && (
                <p className={styles.impact}>{suggestion.estimatedImpact}</p>
            )}

            <div className={styles.actions}>
                <button onClick={() => onApply(suggestion)} className={styles.btnPrimary}>
                    Apply
                </button>
                <button onClick={() => onDismiss(suggestion.id)} className={styles.btnSecondary}>
                    Dismiss
                </button>
            </div>
        </div>
    );
}