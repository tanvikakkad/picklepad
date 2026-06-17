import { MdSportsTennis } from 'react-icons/md';
import styles from './AcademyBadge.module.css';

interface AcademyBadgeProps {
    small?: boolean;
}

export default function AcademyBadge({ small = false }: AcademyBadgeProps) {
    return (
        <span className={`${styles.badge} ${small ? styles.badgeSmall : styles.badgeLarge}`}>
            <MdSportsTennis className={small ? styles.iconSmall : styles.iconLarge} />
            <span className={styles.text}>Academy</span>
        </span>
    );
}