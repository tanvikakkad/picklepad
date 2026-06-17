// src/hooks/useSlots.ts
import { useState } from "react";
import { useSelector } from "react-redux";
import type { Booking, RootState, Slot } from "../types";
import { generateSlots } from "../utils/generateSlots";

const useSlots = (
  courtId: string,
  selectedDate: string,
  openTime: string,
  closeTime: string,
  price: number
) => {

  const bookingsList: Booking[] = useSelector(
    (state: RootState) => state.bookings?.bookingsList ?? []
  );

  const [selectedSlot, setSelectedSlot] = useState<Slot[]>([]);

  const slots = generateSlots(
    courtId,
    selectedDate,
    bookingsList,
    openTime,
    closeTime,
    price,
  );

  const selectSlot = (slot: Slot) => {
    if (slot.status !== "available") return;
    
    const existingIndex = selectedSlot.findIndex((s) => s.id === slot.id);
        if (existingIndex !== -1) {
            setSelectedSlot(selectedSlot.slice(0, existingIndex));
            return;
        }

         if (selectedSlot.length === 0) {
            setSelectedSlot([slot]);
            return;
        }

        const lastSlot = selectedSlot[selectedSlot.length - 1];
        const lastHour = parseInt(lastSlot.endTime.split(':')[0]);
        const thisHour = parseInt(slot.startTime.split(':')[0]);

        if (thisHour === lastHour) {
            // Consecutive — add to selection
            setSelectedSlot([...selectedSlot, slot]);
        } else {
            // Not consecutive — start fresh selection from this slot
            setSelectedSlot([slot]);
        }
    };

  const clearSlot = () => setSelectedSlot([]);

  return {
    slots,
    selectedSlot,
    selectSlot,
    clearSlot,
  };
};

export default useSlots;