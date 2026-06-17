import { useState, useCallback, useRef } from 'react';
import { MdClose, MdAdd, MdDelete, MdSchedule, MdSportsTennis, MdImage } from 'react-icons/md';
import { AREAS, SURFACE_TYPES, AMENITIES } from '../../utils/constants';
import type { Venue, Court } from '../../types';
import styles from './AddCourtForm.module.css';

export type AddCourtFormValues = {
  name: string;
  area: string;
  address: string;
  description: string;
  openTime: string;
  closeTime: string;
  isAcademy: boolean;
  amenities: string[];
  courts: { surfaceType: string; pricePerSlot: number }[];
  images: string[];
  academyCoachName: string;
  academyMonthlyFee: string;
  academyBatchTimings: string;
  academyTrialAvailable: boolean;
};

const defaultCourt = (): { surfaceType: string; pricePerSlot: number } => ({
  surfaceType: SURFACE_TYPES[0] ?? 'Indoor Cushioned',
  pricePerSlot: 500,
});

function venueToFormValues(venue: Venue): AddCourtFormValues {
  return {
    name: venue.name,
    area: venue.area,
    address: venue.address,
    description: venue.description ?? '',
    openTime: venue.openTime ?? '06:00',
    closeTime: venue.closeTime ?? '23:00',
    isAcademy: venue.isAcademy ?? false,
    amenities: Array.isArray(venue.amenities) ? [...venue.amenities] : [],
    courts:
      venue.courts?.length > 0
        ? venue.courts.map((c) => ({
            surfaceType: c.surfaceType,
            pricePerSlot: c.pricePerSlot,
          }))
        : [defaultCourt()],
    images: Array.isArray(venue.images) ? [...venue.images] : [],
    academyCoachName: venue.academyDetails?.coachName ?? '',
    academyMonthlyFee: venue.academyDetails?.monthlyFee?.toString() ?? '',
    academyBatchTimings: venue.academyDetails?.batchTimings?.join(', ') ?? '',
    academyTrialAvailable: venue.academyDetails?.trialAvailable ?? false,
  };
}

export interface AddCourtFormProps {
  mode: 'create' | 'edit';
  initialValues?: Venue | null;
  ownerId: string;
  onSubmit: (venue: Venue) => void;
  onCancel: () => void;
}

export default function AddCourtForm({
  mode,
  initialValues,
  ownerId,
  onSubmit,
  onCancel,
}: AddCourtFormProps) {
  const areaOptions = AREAS.filter((a) => a !== 'All Areas');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<AddCourtFormValues>(() =>
    initialValues
      ? venueToFormValues(initialValues)
      : {
          name: '',
          area: '',
          address: '',
          description: '',
          openTime: '06:00',
          closeTime: '23:00',
          isAcademy: false,
          amenities: [],
          courts: [defaultCourt()],
          images: [],
          academyCoachName: '',
          academyMonthlyFee: '',
          academyBatchTimings: '',
          academyTrialAvailable: false,
        }
  );

  const toggleAmenity = useCallback((amenity: string) => {
    setValues((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  }, []);

  const update = useCallback(<K extends keyof AddCourtFormValues>(
    field: K,
    value: AddCourtFormValues[K]
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateCourt = useCallback((index: number, field: 'surfaceType' | 'pricePerSlot', value: string | number) => {
    setValues((prev) => {
      const next = [...prev.courts];
      if (next[index]) next[index] = { ...next[index], [field]: value };
      return { ...prev, courts: next };
    });
  }, []);

  const addCourt = useCallback(() => {
    setValues((prev) => ({ ...prev, courts: [...prev.courts, defaultCourt()] }));
  }, []);

  const removeCourt = useCallback((index: number) => {
    setValues((prev) => {
      const next = prev.courts.filter((_, i) => i !== index);
      return { ...prev, courts: next.length ? next : [defaultCourt()] };
    });
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim()) return;
    if (values.courts.length === 0) return;

    const area = values.area && areaOptions.includes(values.area) ? values.area : areaOptions[0] ?? 'Bodakdev';

    if (mode === 'edit' && initialValues) {
      const courts: Court[] = values.courts.map((c, i) => ({
        id: initialValues.courts?.[i]?.id ?? `c_${i}`,
        courtNumber: i + 1,
        surfaceType: c.surfaceType,
        pricePerSlot: Number(c.pricePerSlot) || 0,
      }));
      const min = Math.min(...courts.map((c) => c.pricePerSlot));
      const max = Math.max(...courts.map((c) => c.pricePerSlot));
      const venue: Venue = {
        ...initialValues,
        name: values.name.trim(),
        area,
        address: values.address.trim(),
        description: values.description.trim(),
        openTime: values.openTime,
        closeTime: values.closeTime,
        courts,
        amenities: values.amenities,
        isAcademy: values.isAcademy,
        images: values.images,
        academyDetails: values.isAcademy
          ? {
              coachName: values.academyCoachName.trim(),
              batchTimings: values.academyBatchTimings.split(',').map((t) => t.trim()).filter(Boolean),
              monthlyFee: parseInt(values.academyMonthlyFee, 10) || 0,
              trialAvailable: values.academyTrialAvailable,
            }
          : null,
        priceRange: { min, max },
      };
      onSubmit(venue);
      return;
    }

    const venueId = `venue_${Date.now()}`;
    const courts: Court[] = values.courts.map((c, i) => ({
      id: `${venueId}_c${i + 1}`,
      courtNumber: i + 1,
      surfaceType: c.surfaceType,
      pricePerSlot: Number(c.pricePerSlot) || 0,
    }));
    const min = Math.min(...courts.map((c) => c.pricePerSlot));
    const max = Math.max(...courts.map((c) => c.pricePerSlot));

    const venue: Venue = {
      id: venueId,
      ownerId,
      name: values.name.trim(),
      area,
      address: values.address.trim(),
      description: values.description.trim(),
      openTime: values.openTime,
      closeTime: values.closeTime,
      courts,
      amenities: values.amenities,
      rating: 0,
      totalRatings: 0,
      images: values.images,
      isAcademy: values.isAcademy,
      priceRange: { min, max },
      academyDetails: values.isAcademy
        ? {
            coachName: values.academyCoachName.trim(),
            batchTimings: values.academyBatchTimings.split(',').map((t) => t.trim()).filter(Boolean),
            monthlyFee: parseInt(values.academyMonthlyFee, 10) || 0,
            trialAvailable: values.academyTrialAvailable,
          }
        : null,
      isPublished: false,
      createdAt: new Date().toISOString(),
    };
    onSubmit(venue);
  }, [values, areaOptions, mode, initialValues, ownerId, onSubmit]);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {mode === 'create' ? 'Add New Venue' : 'Edit Venue'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className={styles.closeButton}
            aria-label="Close"
          >
            <MdClose className={styles.closeIcon} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.gridTwo}>
            <div>
              <label className={styles.label}>Venue Name</label>
              <input
                type="text"
                value={values.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Paddle House"
                className={styles.input}
                required
              />
            </div>
            <div>
              <label className={styles.label}>Area</label>
              <select
                value={values.area}
                onChange={(e) => update('area', e.target.value)}
                className={styles.select}
              >
                <option value="">Select area</option>
                {areaOptions.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={styles.label}>Address</label>
            <input
              type="text"
              value={values.address}
              onChange={(e) => update('address', e.target.value)}
              placeholder="Full address"
              className={styles.input}
            />
          </div>

          <div>
            <label className={styles.label}>Description</label>
            <textarea
              value={values.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Describe your venue..."
              rows={2}
              className={styles.textarea}
            />
          </div>

          <div className={styles.gridTwo}>
            <div>
              <label className={styles.label}>Opens</label>
              <div className={styles.timeInputWrapper}>
                <input
                  type="time"
                  value={values.openTime}
                  onChange={(e) => update('openTime', e.target.value)}
                  className={styles.timeInput}
                />
                <MdSchedule className={styles.timeIcon} />
              </div>
            </div>
            <div>
              <label className={styles.label}>Closes</label>
              <div className={styles.timeInputWrapper}>
                <input
                  type="time"
                  value={values.closeTime}
                  onChange={(e) => update('closeTime', e.target.value)}
                  className={styles.timeInput}
                />
                <MdSchedule className={styles.timeIcon} />
              </div>
            </div>
          </div>

          <div>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>
                <MdSportsTennis className={styles.sectionIcon} />
                Courts ({values.courts.length})
              </span>
              <button
                type="button"
                onClick={addCourt}
                className={styles.addButton}
              >
                <MdAdd className={styles.addIcon} /> Add Court
              </button>
            </div>
            <div className={styles.courtsContainer}>
              {values.courts.map((court, index) => (
                <div key={index} className={styles.courtCard}>
                  <span className={styles.courtNumber}>
                    {index + 1}
                  </span>
                  <select
                    value={court.surfaceType}
                    onChange={(e) => updateCourt(index, 'surfaceType', e.target.value)}
                    className={styles.courtSelect}
                  >
                    {SURFACE_TYPES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className={styles.priceInput}>
                    <span className={styles.currencySymbol}>₹</span>
                    <input
                      type="number"
                      min={0}
                      value={court.pricePerSlot}
                      onChange={(e) => updateCourt(index, 'pricePerSlot', e.target.value)}
                      className={styles.priceField}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCourt(index)}
                    className={styles.deleteButton}
                    aria-label="Remove court"
                  >
                    <MdDelete className={styles.deleteIcon} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className={styles.label}>Amenities</label>
            <div className={styles.amenitiesContainer}>
              {AMENITIES.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`${styles.amenityButton} ${
                    values.amenities.includes(a)
                      ? styles.amenityButtonActive
                      : styles.amenityButtonInactive
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Venue Images */}
          <div>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>
                <MdImage className={styles.sectionIcon} />
                Images ({values.images.length})
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={styles.addButton}
              >
                <MdAdd className={styles.addIcon} /> Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className={styles.hiddenInput}
                onChange={(e) => {
                  const files = e.target.files;
                  if (!files) return;
                  Array.from(files).forEach((file) => {
                    if (file.size > 5 * 1024 * 1024) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const base64 = reader.result as string;
                      try {
                        const res = await fetch('http://localhost:3002/upload', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ data: base64, name: file.name }),
                        });
                        if (!res.ok) return;
                        const { url } = await res.json();
                        setValues((prev) => ({ ...prev, images: [...prev.images, url] }));
                      } catch {
                        // upload server not reachable
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                  e.target.value = '';
                }}
              />
            </div>
            {values.images.length === 0 && (
              <p className={styles.noImagesText}>No images added yet. The first image will be the cover shown on cards.</p>
            )}
            <div className={styles.gridThree}>
              {values.images.map((src, index) => (
                <div
                  key={index}
                  className={`${styles.imageCard} ${
                    index === 0 ? styles.imageCardCover : styles.imageCardNormal
                  }`}
                  onClick={() => {
                    if (index === 0) return;
                    const reordered = [...values.images];
                    const [moved] = reordered.splice(index, 1);
                    reordered.unshift(moved);
                    update('images', reordered);
                  }}
                  title={index === 0 ? 'Cover image' : 'Click to set as cover'}
                >
                  <img
                    src={src}
                    alt={`Venue ${index + 1}`}
                    className={styles.image}
                  />
                  {index === 0 && (
                    <span className={styles.coverBadge}>
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      update('images', values.images.filter((_, i) => i !== index));
                    }}
                    className={styles.imageDeleteButton}
                    aria-label="Remove image"
                  >
                    <MdDelete className={styles.imageDeleteIcon} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.toggleContainer}>
            <span className={styles.toggleLabel}>This is an Academy</span>
            <button
              type="button"
              role="switch"
              aria-checked={values.isAcademy}
              onClick={() => update('isAcademy', !values.isAcademy)}
              className={`${styles.toggleButton} ${
                values.isAcademy ? styles.toggleButtonActive : styles.toggleButtonInactive
              }`}
            >
              <span
                className={`${styles.toggleSwitch} ${
                  values.isAcademy ? styles.toggleSwitchActive : styles.toggleSwitchInactive
                }`}
              />
            </button>
          </div>

          {values.isAcademy && (
            <div className={styles.academySection}>
              <div>
                <label className={styles.label}>Coach Name</label>
                <input
                  type="text"
                  value={values.academyCoachName}
                  onChange={(e) => update('academyCoachName', e.target.value)}
                  placeholder="e.g. Coach Vikram"
                  className={styles.input}
                />
              </div>
              <div className={styles.academyGrid}>
                <div>
                  <label className={styles.label}>Monthly Fee (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={values.academyMonthlyFee}
                    onChange={(e) => update('academyMonthlyFee', e.target.value)}
                    placeholder="e.g. 3000"
                    className={styles.input}
                  />
                </div>
                <div>
                  <label className={styles.label}>Batch Timings</label>
                  <input
                    type="text"
                    value={values.academyBatchTimings}
                    onChange={(e) => update('academyBatchTimings', e.target.value)}
                    placeholder="06:00-08:00, 16:00-18:00"
                    className={styles.input}
                  />
                </div>
              </div>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={values.academyTrialAvailable}
                  onChange={(e) => update('academyTrialAvailable', e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Free trial available</span>
              </label>
            </div>
          )}

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onCancel}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
            >
              {mode === 'create' ? 'Add Venue' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}