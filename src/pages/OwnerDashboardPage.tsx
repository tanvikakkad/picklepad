// /dashboard/owner
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import {MdBusiness,MdSportsTennis,MdAttachMoney,MdEvent,MdStar,MdEdit,MdDelete,MdPublish,MdUnpublished,MdEventNote,MdTrendingUp} from 'react-icons/md';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/shared/Navbar';
import AddCourtForm from '../components/dashboard/AddCourtForm';
import { BookingCard } from '../components/booking/BookingCard';
import type { BookingCardDisplay } from '../components/booking/BookingCard';
import PricingSuggestionCard from '../components/dashboard/PricingSuggestionCard';
import EmptyState from '../components/shared/EmptyState';
import { getVenuePriceDisplay } from '../utils/constants';
import { usePricingSuggestions } from '../hooks/usePricingSuggestions';
import { addVenueAsync, updateVenueAsync, deleteVenueAsync, togglePublishAsync } from '../store/slices/courtSlice';
import BookingReceipt from '../components/booking/BookingReceipt';
import type { Venue, Booking } from '../types';
import type { AppRootState } from '../store';
import type { AppDispatch } from '../store';
import styles from './OwnerDashboardPage.module.css';

type OwnerTab = 'venues' | 'bookings' | 'pricing' | 'revenue';

/** Map domain Booking + Venue to BookingCardDisplay (owner view, readonly footer) */
function ownerBookingToCardProps(booking: Booking, venue?: Venue): BookingCardDisplay {
  const statusMap = {
    confirmed: 'upcoming' as const,
    completed: 'completed' as const,
    cancelled: 'cancelled' as const,
  };
  const status = statusMap[booking.status];
  return {
    id: booking.id,
    venueName: booking.venueName,
    courtLabel: `Court ${booking.courtNumber}`,
    dateLabel: dayjs(booking.date).format('ddd, MMM D, YYYY'),
    timeLabel: `${booking.startTime} – ${booking.endTime}`,
    locationLabel: venue ? `${venue.area}, Ahmedabad` : booking.venueName,
    priceLabel: `₹${booking.amount}`,
    dateShort: dayjs(booking.createdAt).format('MMM D'),
    status,
    bookingMetaLabel: booking.status,
    footerLabel: 'View',
    footerVariant: 'ghost',
  };
}

/** Per-venue wrapper: usePricingSuggestions(venueId, courts) returns ExtendedSuggestion[] */
function PricingSuggestionsForVenue({
  venue,
  onCountChange,
}: {
  venue: Venue;
  onCountChange: (count: number) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const rawSuggestions = usePricingSuggestions(venue.id, venue.courts ?? []);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());

  const filteredSuggestions = useMemo(
    () => rawSuggestions.filter((s) => !dismissedIds.has(s.id)),
    [rawSuggestions, dismissedIds]
  );

  useEffect(() => {
    onCountChange(filteredSuggestions.length);
  }, [filteredSuggestions.length, onCountChange]);

  const handleApply = useCallback(
    (suggestion: { id: string; suggestedPrice: number }) => {
      const ext = suggestion as { id: string; courtId: string; suggestedPrice: number };
      const updatedCourts = (venue.courts ?? []).map((c) =>
        c.id === ext.courtId ? { ...c, pricePerSlot: ext.suggestedPrice } : c
      );
      const min = Math.min(...updatedCourts.map((c) => c.pricePerSlot));
      const max = Math.max(...updatedCourts.map((c) => c.pricePerSlot));
      dispatch(updateVenueAsync({ ...venue, courts: updatedCourts, priceRange: { min, max } }));
      setDismissedIds((prev) => new Set(prev).add(suggestion.id));
      toast.success('Price updated');
    },
    [dispatch, venue]
  );

  const handleDismiss = useCallback((id: string) => {
    setDismissedIds((prev) => new Set(prev).add(id));
  }, []);

  if (filteredSuggestions.length === 0) return null;
  return (
    <>
      {filteredSuggestions.map((s) => (
        <PricingSuggestionCard
          key={s.id}
          suggestion={{
            ...s,
            changePercent:
              s.currentPrice > 0
                ? Math.round(((s.suggestedPrice - s.currentPrice) / s.currentPrice) * 100)
                : 0,
          }}
          onApply={handleApply}
          onDismiss={handleDismiss}
        />
      ))}
    </>
  );
}

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [activeTab, setActiveTab] = useState<OwnerTab>('venues');
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null);
  const [deleteConfirmVenue, setDeleteConfirmVenue] = useState<Venue | null>(null);
  const [bookingsVenueFilter, setBookingsVenueFilter] = useState<string>('');
  const [bookingsStatusFilter, setBookingsStatusFilter] = useState<string>('');
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);
  const [pricingSuggestionCounts, setPricingSuggestionCounts] = useState<Record<string, number>>({});

  const venuesList = useSelector((s: AppRootState) => s.courts.venuesList);
  const bookingsList = useSelector((s: AppRootState) => s.bookings.bookingsList);
  const ownerId = user?.id ?? '';
  const ownerVenues = venuesList.filter((v) => v.ownerId === ownerId);
  const ownerVenueIds = useMemo(() => new Set(ownerVenues.map((v) => v.id)), [ownerVenues]);
  const venueById = useMemo(() => new Map(venuesList.map((v) => [v.id, v])), [venuesList]);

  const ownerBookings = useMemo(
    () => bookingsList.filter((b) => ownerVenueIds.has(b.venueId)),
    [bookingsList, ownerVenueIds]
  );

  const filteredOwnerBookings = useMemo(() => {
    let list = ownerBookings;
    if (bookingsVenueFilter) list = list.filter((b) => b.venueId === bookingsVenueFilter);
    if (bookingsStatusFilter) list = list.filter((b) => b.status === bookingsStatusFilter);
    return list;
  }, [ownerBookings, bookingsVenueFilter, bookingsStatusFilter]);

  const ownerBookingCards = useMemo(
    () => filteredOwnerBookings.map((b) => ownerBookingToCardProps(b, venueById.get(b.venueId))),
    [filteredOwnerBookings, venueById]
  );

  const ownerCourts = useMemo(
    () => ownerVenues.flatMap((v) => (v.courts ?? []).map((c) => ({ venue: v, court: c }))),
    [ownerVenues]
  );
  const totalPricingSuggestions = useMemo(
    () => Object.values(pricingSuggestionCounts).reduce((a, b) => a + b, 0),
    [pricingSuggestionCounts]
  );

  const totalCourts = ownerVenues.reduce((sum, v) => sum + (v.courts?.length ?? 0), 0);

  const revenueBookings = useMemo(
    () => ownerBookings.filter((b) => b.status === 'confirmed' || b.status === 'completed'),
    [ownerBookings]
  );
  const totalRevenue = useMemo(
    () => revenueBookings.reduce((sum, b) => sum + b.amount, 0),
    [revenueBookings]
  );
  const ownerAvgRating = useMemo(() => {
    if (ownerVenues.length === 0) return 0;
    const total = ownerVenues.reduce((s, v) => s + (v.rating ?? 0) * (v.totalRatings ?? 0), 0);
    const count = ownerVenues.reduce((s, v) => s + (v.totalRatings ?? 0), 0);
    return count > 0 ? total / count : 0;
  }, [ownerVenues]);

  const revenueByVenueId = useMemo(() => {
    const map: Record<string, number> = {};
    revenueBookings.forEach((b) => {
      map[b.venueId] = (map[b.venueId] ?? 0) + b.amount;
    });
    return map;
  }, [revenueBookings]);

  const stats = [
    { label: 'Venues', value: ownerVenues.length, icon: <MdBusiness /> },
    { label: 'Courts', value: totalCourts, icon: <MdSportsTennis /> },
    {
      label: 'Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: <MdAttachMoney />,
    },
    { label: 'Bookings', value: revenueBookings.length, icon: <MdEvent /> },
    {
      label: 'Avg Rating',
      value: ownerVenues.length ? ownerAvgRating.toFixed(1) : '—',
      icon: <MdStar />,
    },
  ];

  const tabs: { key: OwnerTab; label: string }[] = [
    { key: 'venues', label: 'My Venues' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'pricing', label: 'Pricing Suggestions' },
    { key: 'revenue', label: 'Revenue' },
  ];

  function openAddVenue() {
    setFormMode('create');
    setEditingVenue(null);
    setFormOpen(true);
  }

  function handleEditVenue(venue: Venue) {
    setFormMode('edit');
    setEditingVenue(venue);
    setFormOpen(true);
  }

  async function handleFormSubmit(venue: Venue) {
    try {
      if (formMode === 'edit') {
        await dispatch(updateVenueAsync(venue)).unwrap();
        toast.success('Venue updated');
      } else {
        await dispatch(addVenueAsync(venue)).unwrap();
        toast.success('Venue added');
      }
      setFormOpen(false);
      setEditingVenue(null);
    } catch {
      toast.error('Something went wrong');
    }
  }

  function handleFormCancel() {
    setFormOpen(false);
    setEditingVenue(null);
  }

  function handleDeleteVenue(venue: Venue) {
    setDeleteConfirmVenue(venue);
  }

  function confirmDelete() {
    if (!deleteConfirmVenue) return;
    dispatch(deleteVenueAsync(deleteConfirmVenue.id));
    toast.success('Venue deleted');
    setDeleteConfirmVenue(null);
  }

  function handlePublishUnpublish(venue: Venue) {
    dispatch(togglePublishAsync(venue));
    toast.success(venue.isPublished ? 'Venue unpublished' : 'Venue published');
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Owner Dashboard</h1>
              <p className={styles.subtitle}>Manage your venues and track performance</p>
            </div>
            <button
              type="button"
              onClick={openAddVenue}
              className={styles.addButton}
            >
              + Add Venue
            </button>
          </header>

          <section className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statIcon}>
                  {stat.icon}
                </span>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          <div className={styles.tabsWrapper}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`${styles.tab} ${
                  activeTab === tab.key
                    ? styles.tabActive
                    : styles.tabInactive
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <section className={styles.content}>
            {activeTab === 'venues' && (
              <div className={styles.sectionContainer}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>My Venues</h2>
                </div>
                {ownerVenues.length === 0 ? (
                  <EmptyState
                    icon={MdBusiness}
                    title="No venues yet"
                    description="Add your first venue to start receiving bookings and tracking revenue."
                    action={{ label: 'Add Venue', onClick: openAddVenue }}
                  />
                ) : (
                  <div className={styles.venuesGrid}>
                    {ownerVenues.map((venue) => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        onEdit={handleEditVenue}
                        onDelete={handleDeleteVenue}
                        onPublishUnpublish={handlePublishUnpublish}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className={styles.sectionContainer}>
                <h2 className={styles.sectionTitleSmall}>Bookings</h2>

                <div className={styles.filtersContainer}>
                  <div>
                    <label className={styles.filterLabel} htmlFor="owner-bookings-venue">Venue</label>
                    <select
                      id="owner-bookings-venue"
                      value={bookingsVenueFilter}
                      onChange={(e) => setBookingsVenueFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="">All venues</option>
                      {ownerVenues.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={styles.filterLabel} htmlFor="owner-bookings-status">Status</label>
                    <select
                      id="owner-bookings-status"
                      value={bookingsStatusFilter}
                      onChange={(e) => setBookingsStatusFilter(e.target.value)}
                      className={styles.filterSelect}
                    >
                      <option value="">All statuses</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {ownerBookingCards.length === 0 ? (
                  <EmptyState
                    icon={MdEventNote}
                    title={filteredOwnerBookings.length === 0 && ownerBookings.length > 0 ? 'No bookings match filters' : 'No bookings yet'}
                    description={
                      ownerBookings.length === 0
                        ? 'Bookings at your venues will appear here.'
                        : 'Try changing the venue or status filter.'
                    }
                  />
                ) : (
                  <div className={styles.bookingsContainer}>
                    {ownerBookingCards.map((card) => (
                      <BookingCard
                        key={card.id}
                        booking={card}
                        onCancel={(id) => {
                          const b = filteredOwnerBookings.find((x) => x.id === id);
                          if (b) setReceiptBooking(b);
                        }}
                        onRebook={(id) => {
                          const b = filteredOwnerBookings.find((x) => x.id === id);
                          if (b) setReceiptBooking(b);
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'pricing' && (
              <div className={styles.sectionContainer}>
                <div className={styles.pricingHeader}>
                  <h2 className={styles.sectionTitleSmall}>Pricing Suggestions</h2>
                  {totalPricingSuggestions > 0 && (
                    <span className={styles.suggestionBadge}>
                      {totalPricingSuggestions} suggestion{totalPricingSuggestions !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {ownerCourts.length === 0 ? (
                  <EmptyState
                    icon={MdTrendingUp}
                    title="No courts yet"
                    description="Add venues and courts to get pricing suggestions based on booking activity."
                  />
                ) : (
                  <>
                    <div className={styles.pricingGrid}>
                      {ownerVenues.map((venue) => (
                        <PricingSuggestionsForVenue
                          key={venue.id}
                          venue={venue}
                          onCountChange={(count) =>
                            setPricingSuggestionCounts((prev) => ({ ...prev, [venue.id]: count }))
                          }
                        />
                      ))}
                    </div>
                    {totalPricingSuggestions === 0 && (
                      <EmptyState
                        icon={MdTrendingUp}
                        title="No suggestions right now"
                        description="Suggestions are based on the last 30 days of bookings. Check back as activity grows."
                      />
                    )}
                  </>
                )}
              </div>
            )}
            {activeTab === 'revenue' && (
              <div className={styles.sectionContainer}>
                <h2 className={styles.sectionTitleSmall}>Revenue</h2>

                <div className={styles.revenueCard}>
                  <p className={styles.revenueLabel}>Total revenue (confirmed + completed)</p>
                  <p className={styles.revenueValue}>
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className={styles.revenueCount}>
                    From {revenueBookings.length} booking{revenueBookings.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div>
                  <h3 className={styles.breakdownTitle}>Per-venue breakdown</h3>
                  {ownerVenues.length === 0 ? (
                    <EmptyState
                      icon={MdBusiness}
                      title="No venues yet"
                      description="Add venues to see revenue breakdown by venue."
                      action={{ label: 'Add Venue', onClick: openAddVenue }}
                    />
                  ) : (
                    <div className={styles.breakdownList}>
                      {ownerVenues.map((venue) => {
                        const venueRevenue = revenueByVenueId[venue.id] ?? 0;
                        const rating = venue.rating ?? 0;
                        const reviewCount = venue.totalRatings ?? 0;
                        return (
                          <div key={venue.id} className={styles.venueRevenueCard}>
                            <div className={styles.venueRevenueInfo}>
                              <p className={styles.venueRevenueName}>{venue.name}</p>
                              <p className={styles.venueRevenueDetails}>
                                {venue.area} · Rating {rating.toFixed(1)}
                                {reviewCount > 0 && ` (${reviewCount} reviews)`}
                              </p>
                            </div>
                            <div className={styles.venueRevenueAmount}>
                              <p className={styles.venueRevenueValue}>
                                ₹{venueRevenue.toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {formOpen && (
        <AddCourtForm
          key={editingVenue?.id ?? 'create'}
          mode={formMode}
          initialValues={editingVenue}
          ownerId={ownerId}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {receiptBooking && (
        <BookingReceipt
          booking={receiptBooking}
          venueName={receiptBooking.venueName}
          courtNumber={receiptBooking.courtNumber}
          onClose={() => setReceiptBooking(null)}
        />
      )}

      {deleteConfirmVenue && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <p className={styles.modalText}>
              Delete venue <strong>{deleteConfirmVenue.name}</strong>? This cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={() => setDeleteConfirmVenue(null)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function VenueCard({
  venue,
  onEdit,
  onDelete,
  onPublishUnpublish,
}: {
  venue: Venue;
  onEdit: (v: Venue) => void;
  onDelete: (v: Venue) => void;
  onPublishUnpublish: (v: Venue) => void;
}) {
  const priceDisplay = getVenuePriceDisplay(venue);
  const courtCount = venue.courts?.length ?? 0;

  return (
    <div className={styles.venueCard}>
      <div className={styles.venueCardHeader}>
        <div className={styles.venueCardContent}>
          <div className={styles.venueCardTitleWrapper}>
            <h3 className={styles.venueCardTitle}>{venue.name}</h3>
            <span
              className={`${styles.venueCardBadge} ${
                venue.isPublished
                  ? styles.venueCardBadgePublished
                  : styles.venueCardBadgeUnpublished
              }`}
            >
              {venue.isPublished ? 'Published' : 'Unpublished'}
            </span>
          </div>
          <p className={styles.venueCardDetails}>
            {venue.area} · {courtCount} court{courtCount !== 1 ? 's' : ''} · {priceDisplay}
          </p>
        </div>
        <div className={styles.venueCardActions}>
          <button
            type="button"
            onClick={() => onEdit(venue)}
            className={styles.venueActionButton}
            aria-label="Edit venue"
          >
            <MdEdit className={styles.venueActionIcon} />
          </button>
          <button
            type="button"
            onClick={() => onPublishUnpublish(venue)}
            className={styles.venueActionButton}
            aria-label={venue.isPublished ? 'Unpublish' : 'Publish'}
          >
            {venue.isPublished ? (
              <MdUnpublished className={styles.venueActionIcon} />
            ) : (
              <MdPublish className={styles.venueActionIcon} />
            )}
          </button>
          <button
            type="button"
            onClick={() => onDelete(venue)}
            className={styles.venueActionButtonDelete}
            aria-label="Delete venue"
          >
            <MdDelete className={styles.venueActionIcon} />
          </button>
        </div>
      </div>
    </div>
  );
}