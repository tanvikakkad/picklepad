import Navbar from "../components/shared/Navbar";
import { HiSearch, HiAdjustments, HiSortDescending, HiArrowRight, HiLocationMarker, HiShieldCheck, } from "react-icons/hi";
import { MdSportsTennis } from "react-icons/md";
import { useMemo, useState, useCallback, type ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchQuery, setSortBy } from '../store/slices/courtSlice';
import CourtCard from '../components/court/CourtCard';
import CourtFilters from '../components/court/CourtFilters';
import EmptyState from '../components/shared/EmptyState';
import { getVenueMinPrice } from '../utils/constants';
import type { RootState, CourtsState } from '../types';
import Footer from "../components/shared/Footer";
import styles from './HomePage.module.css';

export default function HomePage() {
    const dispatch = useDispatch();
    const { venuesList, searchQuery, filters, sortBy } = useSelector((state: RootState) => state.courts);
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => dispatch(setSearchQuery(e.target.value)),
        [dispatch]
    );

    const filteredVenues = useMemo(() => {
        let result = venuesList.filter((v) => v.isPublished);

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (v) =>
                    v.name.toLowerCase().includes(q) ||
                    v.area.toLowerCase().includes(q) ||
                    v.description.toLowerCase().includes(q)
            );
        }

        if (filters.area !== 'All Areas') {
            result = result.filter((v) => v.area === filters.area);
        }

        result = result.filter((v) => getVenueMinPrice(v) <= filters.maxPrice);

        if (filters.minRating > 0) {
            result = result.filter((v) => v.rating >= filters.minRating);
        }

        if (filters.amenities.length > 0) {
            result = result.filter((v) =>
                filters.amenities.every((a) => v.amenities.includes(a))
            );
        }

        if (!filters.showAcademies) {
            result = result.filter((v) => !v.isAcademy);
        }
        if (!filters.showCourts) {
            result = result.filter((v) => v.isAcademy);
        }

        switch (sortBy) {
            case 'price_low':
                result.sort((a, b) => getVenueMinPrice(a) - getVenueMinPrice(b));
                break;
            case 'price_high':
                result.sort((a, b) => getVenueMinPrice(b) - getVenueMinPrice(a));
                break;
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
            default:
                result.sort((a, b) => b.rating - a.rating);
        }

        return result;
    }, [venuesList, searchQuery, filters, sortBy]);

    return (
        <div className={styles.pageContainer}>
            <Navbar />

            <section className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <div className={styles.heroLayout}>
                        <div className={styles.heroTextCol}>
                            <div className={styles.liveBadgeContainer}>
                                <span className={styles.liveBadgeDot} />
                                <span className={styles.liveBadgeText}>
                                    Live Courts Available
                                </span>
                            </div>

                            <div className={styles.heroTitleContainer}>
                                <h1 className={styles.heroTitleBebas}>
                                    Book Your
                                </h1>
                                <h1 className={styles.heroTitleSerif}>
                                    Pickleball
                                </h1>
                                <h1 className={styles.heroTitleBebas}>
                                    Court Now.
                                </h1>
                            </div>

                            <p className={styles.heroDescription}>
                                Discover venues, pick your slot, and play - all in under 30
                                seconds. No calls, no waiting.
                            </p>

                            <div className={styles.searchContainer}>
                                <div className={styles.searchInputWrapper}>
                                    <HiSearch className={styles.searchIcon} />
                                    <input
                                        type="text"
                                        placeholder="Search venues, areas..."
                                        value={searchQuery}
                                        onChange={handleSearch}
                                        className={styles.searchInput}
                                    />
                                </div>
                                <button className={styles.exploreBtn}>
                                    <span className={styles.exploreBtnText}>Explore</span>
                                    <HiArrowRight className={styles.exploreBtnIcon} />
                                </button>
                            </div>

                            <div className={styles.locationContainer}>
                                <HiLocationMarker className={styles.locationIcon} />
                                <span className={styles.locationLabel}>Location:</span>
                                <span className={styles.locationValue}>
                                    {" "}Ahmedabad
                                </span>
                            </div>
                        </div>

                        <div className={styles.heroVisualCol}>
                            <div className="relative">
                                <div className={styles.visualGlow} />

                                <div className={styles.visualContainer}>
                                    <div className={styles.visualInnerCircle}>
                                        <div className={styles.visualCenterCircle}>
                                            <MdSportsTennis className={styles.visualIcon} />
                                        </div>
                                    </div>

                                    <div className={`${styles.floatingBadge} ${styles.badgeLive}`}>
                                        <span className={styles.badgeLiveDot} />
                                        <span className={styles.badgeLiveText}>Live</span>
                                    </div>

                                    <div className={`${styles.floatingBadge} ${styles.badgeBook}`}>
                                        <span className={styles.badgeBookText}>Book</span>
                                    </div>

                                    <div className={`${styles.floatingBadge} ${styles.badgeSecure}`}>
                                        <HiShieldCheck className={styles.badgeSecureIcon} />
                                        <span className={styles.badgeSecureText}>Secure</span>
                                    </div>

                                    <div className={`${styles.floatingBadge} ${styles.badgePlay}`}>
                                        <span className={styles.badgePlayText}>Play</span>
                                    </div>
                                </div>

                                <p className={styles.madeWithLove}>
                                    Made with <span className={styles.heart}>&#10084;</span> for Ahmedabad
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={styles.contentSection}>
                <div className={styles.contentHeader}>
                    <div className={styles.resultsCount}>
                        <span className={styles.resultsCountValue}>{filteredVenues.length}</span> venues found
                    </div>

                    <div className={styles.controlsContainer}>
                        <div className={styles.sortSelectWrapper}>
                            <HiSortDescending className={styles.sortIcon} />
                            <select
                                value={sortBy}
                                onChange={(e) => dispatch(setSortBy(e.target.value as CourtsState['sortBy']))}
                                className={styles.sortSelect}
                            >
                                <option value="rating">Top Rated</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="name">Name A-Z</option>
                            </select>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={styles.mobileFilterBtn}
                            aria-label="Toggle filters"
                        >
                            <HiAdjustments className={styles.mobileFilterIcon} />
                        </button>
                    </div>
                </div>

                <div className={styles.layoutGrid}>
                    <aside className={styles.sidebar}>
                        <div className={styles.sidebarCard}>
                            <CourtFilters />
                        </div>
                    </aside>

                    {showFilters && (
                        <div className={styles.mobileOverlay}>
                            <div className={styles.mobileBackdrop} onClick={() => setShowFilters(false)} />
                            <div className={styles.mobileDrawer}>
                                <CourtFilters onClose={() => setShowFilters(false)} />
                            </div>
                        </div>
                    )}

                    <div className={styles.mainContent}>
                        {filteredVenues.length === 0 ? (
                            <EmptyState
                                title="No venues found"
                                description="Try adjusting your filters or search query"
                            />
                        ) : (
                            <div className={styles.cardGrid}>
                                {filteredVenues.map((venue) => (
                                    <CourtCard key={venue.id} venue={venue} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
