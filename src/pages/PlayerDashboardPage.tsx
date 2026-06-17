import { useState, useMemo } from 'react';
import { BsCalendarEvent, BsCheckSquare, BsXSquare, BsHeartFill } from 'react-icons/bs';
import {MdCalendarToday,MdCheckCircleOutline,MdCancelPresentation,MdFavoriteBorder} from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import { useAuth } from '../hooks/useAuth';
import { StatCard } from '../components/dashboard/StatCard';
import { BookingCard } from '../components/booking/BookingCard';
import type { BookingCardDisplay } from '../components/booking/BookingCard';
import CourtCard from '../components/court/CourtCard';
import EmptyState from '../components/shared/EmptyState';
import Navbar from '../components/shared/Navbar';
import type { Booking, Venue } from '../types';
import type { AppRootState } from '../store';
import { cancelBookingAsync } from '../store/slices/bookingSlice';
import type { AppDispatch } from '../store';
import styles from './PlayerDashboardPage.module.css';

type PlayerDashboardTab = 'upcoming' | 'completed' | 'cancelled' | 'wishlist';


function bookingToCardProps(booking: Booking, venue?: Venue): BookingCardDisplay {
  const statusMap = {
    confirmed: 'upcoming' as const,
    completed: 'completed' as const,
    cancelled: 'cancelled' as const,
  };
  const status = statusMap[booking.status];
  const isUpcoming = status === 'upcoming';
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
    footerLabel: isUpcoming ? 'Cancel Booking' : 'Rebook',
    footerVariant: isUpcoming ? 'danger' : 'primary',
  };
}

export default function PlayerDashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<PlayerDashboardTab>('upcoming');

  const bookingsList = useSelector((s: AppRootState) => s.bookings.bookingsList);
  const venuesList   = useSelector((s: AppRootState) => s.courts.venuesList);
  const wishlistItems = useSelector((s: AppRootState) => s.wishlist.items);
  const userId = user?.id ?? '';
  const wishlistVenueIds = useMemo(() => wishlistItems[userId] ?? [], [wishlistItems, userId]);

  const venueById = useMemo(() => new Map(venuesList.map((v) => [v.id, v])), [venuesList]);

  const playerBookings  = useMemo(() => bookingsList.filter((b) => b.userId === userId), [bookingsList, userId]);
  const upcomingBookings = useMemo(() => playerBookings.filter((b) => b.status === 'confirmed'), [playerBookings]);
  const completedBookings = useMemo(() => playerBookings.filter((b) => b.status === 'completed'), [playerBookings]);
  const cancelledBookings = useMemo(() => playerBookings.filter((b) => b.status === 'cancelled'), [playerBookings]);

  const upcomingCards  = useMemo(() => upcomingBookings.map((b) => bookingToCardProps(b, venueById.get(b.venueId))), [upcomingBookings, venueById]);
  const completedCards = useMemo(() => completedBookings.map((b) => bookingToCardProps(b, venueById.get(b.venueId))), [completedBookings, venueById]);
  const cancelledCards = useMemo(() => cancelledBookings.map((b) => bookingToCardProps(b, venueById.get(b.venueId))), [cancelledBookings, venueById]);

  const wishlistVenues = useMemo(() => venuesList.filter((v) => wishlistVenueIds.includes(v.id)), [venuesList, wishlistVenueIds]);

  const totalSpent = useMemo(
    () =>
      playerBookings
        .filter((b) => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + b.amount, 0),
    [playerBookings]
  );

  const favouriteArea = useMemo(() => {
    const areaCounts: Record<string, number> = {};
    playerBookings.forEach((b) => {
      const venue = venueById.get(b.venueId);
      const area = venue?.area ?? 'Unknown';
      areaCounts[area] = (areaCounts[area] ?? 0) + 1;
    });
    const entries = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
    return entries.length > 0 ? entries[0][0] : '—';
  }, [playerBookings, venueById]);

  const stats = useMemo(
    () => [
      { label: 'Total Bookings', value: playerBookings.length, icon: <BsCalendarEvent /> },
      { label: 'Upcoming', value: upcomingBookings.length, icon: <BsCalendarEvent /> },
      { label: 'Total Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, icon: <BsCheckSquare /> },
      { label: 'Favourite Area', value: favouriteArea, icon: <BsHeartFill /> },
    ],
    [playerBookings, upcomingBookings, totalSpent, favouriteArea]
  );

  const tabs = [
    { key: 'upcoming'  as const, label: 'Upcoming',  icon: <BsCalendarEvent />,  count: upcomingBookings.length },
    { key: 'completed' as const, label: 'Completed', icon: <BsCheckSquare />,    count: completedBookings.length },
    { key: 'cancelled' as const, label: 'Cancelled', icon: <BsXSquare />,        count: cancelledBookings.length },
    { key: 'wishlist'  as const, label: 'Wishlist',  icon: <BsHeartFill />,      count: wishlistVenues.length },
  ];

  function handleCancel(bookingId: string) {
    dispatch(cancelBookingAsync(bookingId));
  }

  function handleRebook(bookingId: string) {
    const booking = playerBookings.find((b) => b.id === bookingId);
    if (booking) navigate(`/venue/${booking.venueId}`);
  }

  function getCards() {
    switch (activeTab) {
      case 'upcoming':   return upcomingCards;
      case 'completed':  return completedCards;
      case 'cancelled':  return cancelledCards;
      default:           return [];
    }
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <h1 className={styles.title}>
              Welcome back,{' '}
              <span className={styles.userName}>{user?.name ?? 'Guest'}</span>
            </h1>
            <p className={styles.subtitle}>
              Manage your bookings and saved venues
            </p>
          </header>

          <section className={styles.statsGrid}>
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                className={styles.statCard}
              />
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
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <section className={styles.content}>
            {activeTab === 'wishlist' ? (
              wishlistVenues.length === 0 ? (
                <EmptyState
                  icon={MdFavoriteBorder}
                  title="No saved venues yet"
                  description="Heart a court from the Explore page and it will show up here for quick booking."
                  action={{ label: 'Explore Courts', onClick: () => navigate('/') }}
                />
              ) : (
                <div className={styles.wishlistGrid}>
                  {wishlistVenues.map((venue) => (
                    <CourtCard key={venue.id} venue={venue} />
                  ))}
                </div>
              )
            ) : (
              getCards().length === 0 ? (
                <EmptyState
                  icon={
                    activeTab === 'upcoming'
                      ? MdCalendarToday
                      : activeTab === 'completed'
                        ? MdCheckCircleOutline
                        : MdCancelPresentation
                  }
                  title={`No ${activeTab} bookings`}
                  description={
                    activeTab === 'upcoming'
                      ? 'Book a court to get started — your confirmed sessions will appear here.'
                      : activeTab === 'completed'
                        ? 'Completed bookings will show up here after your court sessions are done.'
                        : "You haven't cancelled any bookings. Let's keep it that way!"
                  }
                  action={{ label: 'Explore Courts', onClick: () => navigate('/') }}
                />
              ) : (
                <div className={styles.bookingsContainer}>
                  {getCards().map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onCancel={handleCancel}
                      onRebook={handleRebook}
                    />
                  ))}
                </div>
              )
            )}
          </section>
        </div>
      </div>
    </>
  );
}
