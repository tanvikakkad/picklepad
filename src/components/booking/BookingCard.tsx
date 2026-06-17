import {
  BsBuilding,
  BsCalendar3,
  BsClock,
  BsGeoAlt,
} from 'react-icons/bs';
import type { Booking } from '../../types';
import styles from './BookingCard.module.css';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface BookingCardDisplay {
  id: string;
  venueName: string;
  courtLabel: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  priceLabel: string;
  dateShort?: string;
  status: BookingStatus;
  bookingMetaLabel: string;
  footerLabel: string;
  footerVariant: 'primary' | 'ghost' | 'danger';
}

export type { Booking };

export interface BookingCardProps {
  booking: BookingCardDisplay;
  onCancel?: (bookingId: string) => void;
  onRebook?: (bookingId: string) => void;
}

const STATUS_BADGE: Record<BookingStatus, string> = {
  upcoming: styles.upcomingBadge,
  completed: styles.completedBadge,
  cancelled: styles.cancelledBadge,
};

export function BookingCard({ booking, onCancel, onRebook }: BookingCardProps) {
  const {
    id,
    venueName,
    courtLabel,
    dateLabel,
    timeLabel,
    locationLabel,
    priceLabel,
    dateShort,
    status,
    bookingMetaLabel,
    footerLabel,
    footerVariant,
  } = booking;

  const badgeClass = STATUS_BADGE[status] ?? styles.upcomingBadge;

  const handleAction = () => {
    if (status === 'upcoming') {
      return onCancel ? onCancel(id) : console.log('[BookingCard] onCancel –', id);
    } else {
      return onRebook ? onRebook(id) : console.log('[BookingCard] onRebook –', id);
    }
  };

  const footerBtnClass = `${styles.footerBtn} ${styles[`${footerVariant}Btn`]}`;

  return (
    <article className={styles.bookingCard}>
      <div className={styles.headerRow}>
        <div className={styles.venueBadgeContainer}>
          <h3 className={styles.venueName}>{venueName}</h3>
          <span
            className={`${styles.statusBadge} ${badgeClass}`}
          >
            {bookingMetaLabel}
          </span>
        </div>

        <div className={styles.priceContainer}>
          <p className={styles.priceLabel}>{priceLabel}</p>
          {dateShort && (
            <p className={styles.dateShort}>{dateShort}</p>
          )}
        </div>
      </div>

      <p className={styles.courtLabel}>
        <BsBuilding className={styles.iconShrink} />
        {courtLabel}
      </p>

      <ul className={styles.detailsList}>
        <li className={styles.detailItem}>
          <BsCalendar3 className={styles.iconDetail} />
          <span>{dateLabel}</span>
        </li>
        <li className={styles.detailItem}>
          <BsClock className={styles.iconDetail} />
          <span>{timeLabel}</span>
        </li>
        <li className={styles.detailItem}>
          <BsGeoAlt className={styles.iconDetail} />
          <span>{locationLabel}</span>
        </li>
      </ul>

      <div className={styles.footerContainer}>
        <button type="button" onClick={handleAction} className={footerBtnClass}>
          {footerLabel}
        </button>
      </div>
    </article>
  );
}

export default BookingCard;
