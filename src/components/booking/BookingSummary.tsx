// src/components/booking/BookingSummary.tsx
import type { Slot } from '../../types';
import styles from './BookingSummary.module.css';

interface BookingSummaryProps {
    selectedSlots: Slot[];
    totalPrice: number;
    courtNumber?: number;
    venueName: string;
    isLoggedIn: boolean;
    onConfirm: () => void;
    onClear: () => void;
}

export default function BookingSummary({
    selectedSlots,
    totalPrice,
    courtNumber,
    venueName,
    isLoggedIn,
    onConfirm,
    onClear,
}: BookingSummaryProps) {

    if (selectedSlots.length === 0) return null;

    const firstSlot = selectedSlots[0];
    const lastSlot  = selectedSlots[selectedSlots.length - 1];

    return (
        <div className={`${styles.container} card`}>
            <h3 className={styles.heading}>Booking Summary</h3>

            {/* Court + venue */}
            <p className={styles.subtext}>
                Court {courtNumber} · {venueName}
            </p>

            {/* Each slot row */}
            <div className={styles.slotList}>
                {selectedSlots.map((slot) => (
                    <div key={slot.id} className={styles.slotRow}>
                        <span className={styles.slotTime}>
                            {slot.startTime} — {slot.endTime}
                        </span>
                        <span className={styles.slotPrice}>₹{slot.price}</span>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className={styles.totalWrapper}>
                <div className={styles.totalRow}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>₹{totalPrice}</span>
                </div>
                <p className={styles.totalMeta}>
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} ·{' '}
                    {firstSlot.startTime} — {lastSlot.endTime}
                </p>
            </div>

            <div className={styles.buttonRow}>
                <button
                    onClick={onClear}
                    className={styles.clearBtn}
                >
                    Clear
                </button>
                <button
                    onClick={onConfirm}
                    className={`${styles.confirmBtn} btn-primary`}
                >
                    {isLoggedIn ? 'Confirm Booking' : 'Sign in to Book'}
                </button>
            </div>
        </div>
    );
}