import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters } from '../../store/slices/courtSlice';
import { AREAS, AMENITIES } from '../../utils/constants';
import { HiX } from 'react-icons/hi';
import type { RootState } from '../../types';
import type { ChangeEvent } from 'react';
import styles from './CourtFilters.module.css';

interface CourtFiltersProps {
    onClose?: () => void;
}

export default function CourtFilters({ onClose }: CourtFiltersProps) {
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.courts.filters);

    function handleAreaChange(area: string) {
        dispatch(setFilters({ area }));
    }

    function handleMaxPriceChange(e: ChangeEvent<HTMLInputElement>) {
        dispatch(setFilters({ maxPrice: parseInt(e.target.value, 10) }));
    }

    function handleMinRatingChange(rating: number) {
        dispatch(setFilters({ minRating: filters.minRating === rating ? 0 : rating }));
    }

    function handleAmenityToggle(amenity: string) {
        const current = filters.amenities;
        const updated = current.includes(amenity)
            ? current.filter((a) => a !== amenity)
            : [...current, amenity];
        dispatch(setFilters({ amenities: updated }));
    }

    function handleTypeToggle(type: 'academies' | 'courts') {
        if (type === 'academies') {
            dispatch(setFilters({ showAcademies: !filters.showAcademies }));
        } else {
            dispatch(setFilters({ showCourts: !filters.showCourts }));
        }
    }

    function handleReset() {
        dispatch(resetFilters());
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headerTitle}>Filters</h3>
                <div className={styles.headerActions}>
                    <button onClick={handleReset} className={styles.resetBtn}>
                        Reset
                    </button>
                    {onClose && (
                        <button onClick={onClose} className={`md:hidden ${styles.closeBtn}`}>
                            <HiX />
                        </button>
                    )}
                </div>
            </div>

            <div>
                <label className={styles.sectionLabel}>Area</label>
                <div className={styles.chipGrid}>
                    {AREAS.map((area) => (
                        <button
                            key={area}
                            onClick={() => handleAreaChange(area)}
                            className={filters.area === area ? styles.chipActive : styles.chip}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className={styles.sectionLabel}>
                    Max Price: <span className={styles.priceValue}>₹{filters.maxPrice}/hr</span>
                </label>
                <input
                    type="range"
                    min="200"
                    max="1500"
                    step="50"
                    value={filters.maxPrice}
                    onChange={handleMaxPriceChange}
                    className={styles.rangeInput}
                />
                <div className={styles.rangeLabels}>
                    <span>₹200</span>
                    <span>₹1500</span>
                </div>
            </div>

            <div>
                <label className={styles.sectionLabel}>Minimum Rating</label>
                <div className={styles.chipRow}>
                    {[3, 3.5, 4, 4.5].map((rating) => (
                        <button
                            key={rating}
                            onClick={() => handleMinRatingChange(rating)}
                            className={filters.minRating === rating ? styles.ratingChipActive : styles.ratingChip}
                        >
                            {rating}+ ⭐
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className={styles.sectionLabel}>Type</label>
                <div className={styles.chipRow}>
                    <button
                        onClick={() => handleTypeToggle('courts')}
                        className={filters.showCourts ? styles.typeChipCourtsActive : styles.typeChipCourts}
                    >
                        Courts
                    </button>
                    <button
                        onClick={() => handleTypeToggle('academies')}
                        className={filters.showAcademies ? styles.typeChipAcademiesActive : styles.typeChipAcademies}
                    >
                        Academies
                    </button>
                </div>
            </div>

            <div>
                <label className={styles.sectionLabel}>Amenities</label>
                <div className={styles.chipGrid}>
                    {AMENITIES.map((amenity) => (
                        <button
                            key={amenity}
                            onClick={() => handleAmenityToggle(amenity)}
                            className={filters.amenities.includes(amenity) ? styles.amenityChipActive : styles.amenityChip}
                        >
                            {amenity}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
