import { useSelector } from "react-redux";
import type { RootState, Slot } from "../../types";
import { generateSlots } from "../../utils/generateSlots";
import styles from './SlotGrid.module.css';

interface SlotGridProps {
  courtId: string;
  selectedDate: string;
  openTime: string;
  closeTime: string;
  price: number;
  selectedSlots: Slot[];
  onToggleSlot: (slot: Slot) => void;
}

const SlotGrid = ({
  courtId,
  selectedDate,
  openTime,
  closeTime,
  price,
  selectedSlots,
  onToggleSlot,
}: SlotGridProps) => {

   const bookingsList = useSelector(
        (state: RootState) => state.bookings.bookingsList
    );
    
  const  slots = generateSlots(
    courtId,
    selectedDate,
    bookingsList,
    openTime,
    closeTime,
    price,
  );

    const isSelected = (slot: Slot) =>
        selectedSlots.some((s) => s.id === slot.id);

    function getSlotStyle(slot: Slot): string {
        if (slot.status === 'past') return styles.slotPast;
        if (slot.status === 'booked') return styles.slotBooked;
        if (isSelected(slot)) return styles.slotSelected;
        return styles.slotAvailable;
    }

    return (
        <div>
            <div className={styles.legend}>
                <div className={styles.legendItem}>
                    <div className={styles.legendDotAvailable} />
                    <span className={styles.legendLabel}>Available</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendDotSelected} />
                    <span className={styles.legendLabel}>Selected</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendDotBooked} />
                    <span className={styles.legendLabel}>Booked</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendDotPast} />
                    <span className={styles.legendLabel}>Past</span>
                </div>
            </div>

            <div className={styles.grid}>
                {slots.map((slot) => (
                    <div
                        key={slot.id}
                        onClick={() => onToggleSlot(slot)}
                        className={`${styles.slot} ${getSlotStyle(slot)}`}
                    >
                        <p className={styles.slotTime}>{slot.startTime}</p>
                        <p className={styles.slotEndTime}>{slot.endTime}</p>
                        <p className={styles.slotLabel}>
                            {slot.status === 'past'
                                ? 'Past'
                                : slot.status === 'booked'
                                ? 'Booked'
                                : isSelected(slot)
                                ? 'Selected'
                                : `₹${slot.price}`}
                        </p>
                    </div>
                ))}
            </div>

            {selectedSlots.length > 0 && (
                <p className={styles.selectionHint}>
                    {selectedSlots.length} slot{selectedSlots.length > 1 ? 's' : ''} ·{' '}
                    {selectedSlots[0].startTime} — {selectedSlots[selectedSlots.length - 1].endTime}
                    {' '}· Click a selected slot to trim from there
                </p>
            )}
        </div>
    );
}

export default SlotGrid;