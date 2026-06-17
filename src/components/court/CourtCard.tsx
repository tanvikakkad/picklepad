import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../../store/slices/wishlistSlice';
import { useAuth } from '../../hooks/useAuth';
import AcademyBadge from './AcademyBadge';
import { getVenuePriceDisplay } from '../../utils/constants';
import { HiHeart, HiOutlineHeart, HiLocationMarker, HiStar } from 'react-icons/hi';
import { MdSportsTennis } from 'react-icons/md';
import toast from 'react-hot-toast';
import type { Venue, RootState } from '../../types';
import type { MouseEvent } from 'react';
import styles from './CourtCard.module.css';

interface CourtCardProps {
    venue: Venue;
}

export default function CourtCard({ venue }: CourtCardProps) {
    const dispatch = useDispatch();
    const { user, isLoggedIn } = useAuth();
    const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
    const isWishlisted = isLoggedIn && wishlistItems[user?.id ?? '']?.includes(venue.id);

    function handleWishlist(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn || !user) {
            toast.error('Sign in to save venues');
            return;
        }
        dispatch(toggleWishlist({ userId: user.id, venueId: venue.id }));
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    }

    const courtCount = venue.courts?.length || 0;

    return (
        <Link to={`/venue/${venue.id}`} className={styles.link}>
            <div className={`card-hover ${styles.card}`}>
                <div className={styles.imageContainer}>
                    {venue.images?.[0] ? (
                        <img
                            src={venue.images[0]}
                            alt={venue.name}
                            className={styles.image}
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <span className={styles.placeholderIcon}>🏓</span>
                        </div>
                    )}

                    <button
                        onClick={handleWishlist}
                        className={styles.wishlistBtn}
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        {isWishlisted ? (
                            <HiHeart className={styles.wishlistIconActive} />
                        ) : (
                            <HiOutlineHeart className={styles.wishlistIconInactive} />
                        )}
                    </button>

                    {venue.isAcademy && (
                        <div className={styles.badgePosition}>
                            <AcademyBadge small />
                        </div>
                    )}

                    <div className={`badge-lime ${styles.priceBadge}`}>
                        {getVenuePriceDisplay(venue)}
                    </div>

                    <div className={styles.courtCountBadge}>
                        <MdSportsTennis className={styles.courtCountIcon} />
                        {courtCount} {courtCount === 1 ? 'Court' : 'Courts'}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <h3 className={styles.title}>
                            {venue.name}
                        </h3>
                        <div className={styles.ratingWrapper}>
                            <HiStar className={styles.ratingStar} />
                            <span className={styles.ratingValue}>{venue.rating}</span>
                            <span className={styles.ratingCount}>({venue.totalRatings})</span>
                        </div>
                    </div>

                    <div className={styles.location}>
                        <HiLocationMarker className={styles.locationIcon} />
                        <span className={styles.locationText}>{venue.area}, Ahmedabad</span>
                    </div>

                    <div className={styles.amenities}>
                        {venue.amenities.slice(0, 4).map((amenity) => (
                            <span
                                key={amenity}
                                className={styles.amenityTag}
                            >
                                {amenity}
                            </span>
                        ))}
                        {venue.amenities.length > 4 && (
                            <span className={styles.amenityMore}>
                                +{venue.amenities.length - 4}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
