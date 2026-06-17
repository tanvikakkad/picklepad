// src/pages/CourtDetailPage.tsx
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBooking } from '../hooks/useBooking';
import Navbar from '../components/shared/Navbar';
import SlotGrid from '../components/court/SlotGrid';
import BookingSummary from '../components/booking/BookingSummary';
import BookingReceipt from '../components/booking/BookingReceipt';
import AcademyBadge from '../components/court/AcademyBadge';
import { getVenuePriceDisplay } from '../utils/constants';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { HiLocationMarker, HiClock, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { MdSportsTennis } from 'react-icons/md';
import type { RootState, Booking, Slot, Court } from '../types';
import ReviewForm from '../components/review/ReviewForm';
import ReviewList from '../components/review/ReviewList';
import styles from './CourtDetailPage.module.css';


export default function CourtDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();

    const venue = useSelector((state: RootState) =>
        state.courts.venuesList.find((v) => v.id === id)
    );
    const reviews = useSelector((state: RootState) =>
        state.reviews.reviewsList.filter((r) => r.venueId === id)
    );
    const bookingsList = useSelector((state: RootState) =>
        state.bookings.bookingsList
    );

    const { createBooking } = useBooking(user?.id);

    const firstCourtId = venue?.courts?.[0]?.id ?? null;
    const [selectedCourtId, setSelectedCourtId] = useState<string | null>(firstCourtId);

    const effectiveCourtId = selectedCourtId ?? firstCourtId;

    const [selectedDate, setSelectedDate] = useState(
        dayjs().format('YYYY-MM-DD')
    );
    const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
    const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
    const [heroIndex, setHeroIndex] = useState(0);
    const heroImages = venue?.images?.length ? venue.images : [];

    const selectedCourt: Court | undefined = venue?.courts.find(
        (c) => c.id === effectiveCourtId
    );

    const totalPrice = selectedSlots.reduce((sum, s) => sum + s.price, 0);

    const dates = useMemo(() =>
        Array.from({ length: 7 }, (_, i) => {
            const date = dayjs().add(i, 'day');
            return {
                value:   date.format('YYYY-MM-DD'),
                dayName: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.format('ddd'),
                dayNum:  date.format('D'),
                month:   date.format('MMM'),
            };
        }), []
    );

    const hasBooking = useMemo(() => {
        if (!user) return false;
        return bookingsList.some(
            (b) =>
                b.userId === user.id &&
                b.venueId === id &&
                (b.status === 'confirmed' || b.status === 'completed')
        );
    }, [bookingsList, user, id]);

    function clearSelection() {
        setSelectedSlots([]);
    }

    function toggleSlot(slot: Slot) {
        if (slot.status !== 'available') return;

        const existingIndex = selectedSlots.findIndex((s) => s.id === slot.id);


        if (existingIndex !== -1) {
            setSelectedSlots(selectedSlots.slice(0, existingIndex));
            return;
        }

        if (selectedSlots.length === 0) {
            setSelectedSlots([slot]);
            return;
        }

        const lastSlot  = selectedSlots[selectedSlots.length - 1];
        const lastHour  = parseInt(lastSlot.endTime.split(':')[0]);
        const thisHour  = parseInt(slot.startTime.split(':')[0]);

        if (thisHour === lastHour) {
            setSelectedSlots([...selectedSlots, slot]);
        } else {
          setSelectedSlots([slot]);
        }
    }

    function handleConfirmBooking() {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: `/venue/${id}` } });
            return;
        }
        if (!effectiveCourtId) {
            toast.error('Select a court first');
            return;
        }
        if (selectedSlots.length === 0) {
            toast.error('Select at least one slot');
            return;
        }

        const newBooking = createBooking({
            venueId:     id!,
            venueName:   venue!.name,
            courtId:     effectiveCourtId,
            courtNumber: selectedCourt!.courtNumber,
            date:        selectedDate,
            slots:       selectedSlots,
            totalAmount: totalPrice,
        });

        setReceiptBooking(newBooking);
        clearSelection();
        toast.success('Booking confirmed! ');
    }

    if (!venue) {
        return (
            <div className={styles.pageContainer}>
                <Navbar />
                <div className={styles.notFoundText}>
                    Venue not found
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <div className={styles.heroSection}>
                <div className={styles.heroContainer}>
                    {heroImages.length > 0 ? (
                        <>
                            <img
                                src={heroImages[heroIndex]}
                                alt={`${venue.name} ${heroIndex + 1}`}
                                className={styles.heroImage}
                            />
                            {heroImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setHeroIndex((i) => (i - 1 + heroImages.length) % heroImages.length)}
                                        className={`${styles.heroNavButton} left-3`}
                                        aria-label="Previous image"
                                    >
                                        <HiChevronLeft className="text-lg" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setHeroIndex((i) => (i + 1) % heroImages.length)}
                                        className={`${styles.heroNavButton} right-3`}
                                        aria-label="Next image"
                                    >
                                        <HiChevronRight className="text-lg" />
                                    </button>
                                    <div className={styles.dotContainer}>
                                        {heroImages.map((_, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setHeroIndex(i)}
                                                className={`${styles.dotButton} ${i === heroIndex ? styles.activeDot : styles.inactiveDot}`}
                                                aria-label={`Go to image ${i + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </>
                    ) : (
                        <div className={styles.heroPlaceholder}>
                            <MdSportsTennis className={styles.heroPlaceholderIcon} />
                        </div>
                    )}
                    <div className={styles.heroOverlay} />
                    <div className={styles.heroBottom}>
                        <div className={styles.heroBadgeContainer}>
                            {venue.isAcademy && <AcademyBadge />}
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.contentGrid}>

                    <div className={styles.leftColumn}>

                        <div className={styles.venueCard}>
                            <h1 className={styles.venueTitle}>
                                {venue.name}
                            </h1>

                            <div className={styles.venueInfo}>
                                <div className={styles.venueInfoItem}>
                                    <HiLocationMarker className={styles.venueLocationIcon} />
                                    <span className={styles.venueInfoText}>{venue.address}</span>
                                </div>
                                <div className={styles.venueInfoItem}>
                                   
                                </div>
                                <div className={styles.venueInfoItem}>
                                    <HiClock />
                                    <span className={styles.venueInfoText}>
                                        {venue.openTime} – {venue.closeTime}
                                    </span>
                                </div>
                                <div className={styles.venueInfoItem}>
                                    <MdSportsTennis className={styles.venueLocationIcon} />
                                    <span className={styles.venueInfoText}>
                                        {venue.courts.length}{' '}
                                        {venue.courts.length === 1 ? 'court' : 'courts'}
                                    </span>
                                </div>
                            </div>

                            <p className={styles.venueDescription}>
                                {venue.description}
                            </p>

                            <div className={styles.venueAmenities}>
                                {venue.amenities.map((amenity) => (
                                    <span
                                        key={amenity}
                                        className={styles.amenityTag}
                                    >
                                        {amenity}
                                    </span>
                                ))}
                            </div>

                            {venue.isAcademy && venue.academyDetails && (
                                <div className={styles.academySection}>
                                    <h3 className={styles.academyTitle}>
                                         Academy Details
                                    </h3>
                                    <div className={styles.academyGrid}>
                                        <div>
                                            <span className={styles.academyLabel}>Coach</span>
                                            <div className={styles.academyValue}>
                                                {venue.academyDetails.coachName}
                                            </div>
                                        </div>
                                        <div>
                                            <span className={styles.academyLabel}>Monthly Fee</span>
                                            <div className={styles.academyValue}>
                                                ₹{venue.academyDetails.monthlyFee}
                                            </div>
                                        </div>
                                        <div className={styles.academyBatch}>
                                            <span className={styles.academyLabel}>Batch Timings</span>
                                            <div className={styles.academyTimings}>
                                                {venue.academyDetails.batchTimings.map((t) => (
                                                    <span key={t} className={styles.academyTiming}>
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        {venue.academyDetails.trialAvailable && (
                                            <div className={styles.academyTrial}>
                                                 Free trial available
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.bookingCard}>
                            <h2 className={styles.bookingTitle}>
                                Book a Slot
                            </h2>
                            <p className={styles.bookingSubtitle}>
                                Select a court, pick a date, then choose your time slot
                            </p>

                            <div className={styles.stepSection}>
                                <h3 className={styles.stepTitle}>
                                    Step 1 — Select a Court
                                </h3>
                                <div className={styles.courtContainer}>
                                    {venue.courts.map((court) => (
                                        <button
                                            key={court.id}
                                            onClick={() => {
                                                setSelectedCourtId(court.id);
                                                clearSelection();
                                            }}
                                            className={`${styles.courtButton} ${effectiveCourtId === court.id ? styles.selectedCourt : styles.unselectedCourt}`}
                                        >
                                            <div className={`${styles.courtIcon} ${effectiveCourtId === court.id ? styles.selectedIcon : styles.unselectedIcon}`}
                                            >
                                                <MdSportsTennis className="text-lg" />
                                            </div>
                                            <span className={`${styles.courtName} ${effectiveCourtId === court.id ? styles.selectedText : styles.unselectedText}`}>
                                                Court {court.courtNumber}
                                            </span>
                                            <span className={styles.courtSurface}>
                                                {court.surfaceType}
                                            </span>
                                            <span className={`${styles.courtPrice} ${effectiveCourtId === court.id ? styles.selectedPrice : styles.unselectedPrice}`}>
                                                ₹{court.pricePerSlot}/hr
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {effectiveCourtId && (
                                <div className={styles.dateSection}>
                                    <h3 className={styles.stepTitle}>
                                        Step 2 — Choose Date
                                    </h3>
                                    <div className={styles.dateContainer}>
                                        {dates.map((d) => (
                                            <button
                                                key={d.value}
                                                onClick={() => {
                                                    setSelectedDate(d.value);
                                                    clearSelection();
                                                }}
                                                className={`${styles.dateButton} ${selectedDate === d.value ? styles.selectedDate : styles.unselectedDate}`}
                                            >
                                                <span className={styles.dateDayName}>{d.dayName}</span>
                                                <span className={styles.dateDayNum}>{d.dayNum}</span>
                                                <span className={styles.dateMonth}>{d.month}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {effectiveCourtId && selectedDate && (
                                <div className={styles.slotSection}>
                                    <h3 className={styles.stepTitle}>
                                        Step 3 — Pick Time Slots
                                    </h3>
                                    <SlotGrid
                                        courtId={effectiveCourtId}
                                        selectedDate={selectedDate}
                                        price={selectedCourt?.pricePerSlot ?? 0}
                                        openTime={venue.openTime}
                                        closeTime={venue.closeTime}
                                        selectedSlots={selectedSlots}
                                        onToggleSlot={toggleSlot}
                                    />
                                </div>
                            )}


                            {!effectiveCourtId && (
                                <div className={styles.emptyState}>
                                    <MdSportsTennis className={styles.emptyStateIcon} />
                                    <p className={styles.emptyStateText}>
                                        Select a court above to see available slots
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className={styles.reviewsTitle}>Reviews</h2>
                            {isLoggedIn && hasBooking && (
                                <div className={styles.reviewsSection}>
                                    <ReviewForm venueId={id!} />
                                </div>
                            )}
                            <ReviewList reviews={reviews} />
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.stickyContainer}>

                            <div className={styles.priceCard}>
                                <div className={styles.priceDisplay}>
                                    {getVenuePriceDisplay(venue)}
                                </div>
                                <div className={styles.priceSubtitle}>
                                    {venue.courts.length}{' '}
                                    {venue.courts.length === 1 ? 'court' : 'courts'} available
                                </div>
                                {selectedCourt && (
                                    <div className={styles.selectedCourtDisplay}>
                                        <div className={styles.selectedCourtLabel}>Selected</div>
                                        <div className={styles.selectedCourtInfo}>
                                            Court {selectedCourt.courtNumber} · ₹{selectedCourt.pricePerSlot}/hr
                                        </div>
                                        <div className={styles.selectedCourtType}>
                                            {selectedCourt.surfaceType}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <BookingSummary
                                selectedSlots={selectedSlots}
                                totalPrice={totalPrice}
                                courtNumber={selectedCourt?.courtNumber}
                                venueName={venue.name}
                                isLoggedIn={isLoggedIn}
                                onConfirm={handleConfirmBooking}
                                onClear={clearSelection}
                            />

                        </div>
                    </div>

                </div>
            </div>

            {receiptBooking && (
                <BookingReceipt
                    booking={receiptBooking}
                    venueName={venue.name}
                    courtNumber={selectedCourt?.courtNumber ?? 1}
                    onClose={() => setReceiptBooking(null)}
                />
            )}

        </div>
    );
}