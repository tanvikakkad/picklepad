import { HiX, HiCheckCircle, HiClipboardCopy } from 'react-icons/hi';
import { MdSportsTennis } from 'react-icons/md';
import toast from 'react-hot-toast';
import type { Booking } from '../../types';
import styles from './BookingReceipt.module.css';

interface BookingReceiptProps {
    booking: Booking | null;
    venueName: string;
    courtNumber: number;
    onClose: () => void;
}

export default function BookingReceipt({ booking, venueName, courtNumber, onClose }: BookingReceiptProps) {
    if (!booking) return null;

    function copyId() {
        navigator.clipboard.writeText(booking!.id);
        toast.success('Booking ID copied!');
    }

    return (
        <div className={styles.root}>
            {/* Overlay */}
            <div className={styles.overlay} onClick={onClose} />

            {/* Modal */}
            <div className={`${styles.modal} card`}>
                <button
                    onClick={onClose}
                    className={styles.closeBtn}
                    aria-label="Close receipt"
                >
                    <HiX className={styles.iconXL} />
                </button>

                {/* Success Icon */}
                <div className={styles.successIconContainer}>
                    <div className={styles.successIconWrapper}>
                        <HiCheckCircle className={styles.checkIcon} />
                    </div>
                    <h2 className={styles.heading}>Booking Confirmed!</h2>
                    <p className={styles.subtext}>Your court is reserved </p>
                </div>

                {/* Details */}
                <div className={styles.detailsSection}>
                    <div className={styles.row}>
                        <span className={styles.label}>Venue</span>
                        <span className={styles.value}>{venueName}</span>
                    </div>
                    <div className={styles.rowCenter}>
                        <span className={styles.label}>Court</span>
                        <span className={styles.courtValue}>
                            <MdSportsTennis className={styles.iconXS} />
                            Court {courtNumber}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Date</span>
                        <span className={styles.value}>{booking.date}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Time</span>
                        <span className={styles.value}>
                            {booking.startTime} — {booking.endTime}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Amount</span>
                        <span className={styles.amountValue}>₹{booking.amount}</span>
                    </div>
                    <div className={styles.borderTop}>
                        <div className={styles.itemsBetween}>
                            <div>
                                <span className={styles.bookingIdLabel}>Booking ID</span>
                                <div className={styles.bookingId}>{booking.id}</div>
                            </div>
                            <button
                                onClick={copyId}
                                className={styles.copyBtn}
                                aria-label="Copy booking ID"
                            >
                                <HiClipboardCopy className={styles.iconLG} />
                            </button>
                        </div>
                    </div>
                </div>

                <button onClick={onClose} className={`${styles.doneBtn} btn-primary`}>
                    Done
                </button>
            </div>
        </div>
    );
}
