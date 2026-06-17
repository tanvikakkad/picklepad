import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

type TrendDirection = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  trendDirection?: TrendDirection;
  trendLabel?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export function StatCard({
  icon,
  label,
  value,
  isActive,
  onClick,
  className,
}: StatCardProps) {
  const Root = onClick ? 'button' : 'div';

  return (
    <Root
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        styles.root,
        isActive ? styles.active : styles.default,
        onClick && styles.interactive,
        className
      )}
    >
      {icon && (
        <span
          className={cn(
            styles.icon,
            isActive ? styles.iconActive : styles.iconDefault
          )}
        >
          {icon}
        </span>
      )}

      <p className={styles.value} title={typeof value === 'string' ? value : undefined}>
        {value}
      </p>

      <p
        className={cn(
          styles.label,
          isActive ? styles.labelActive : styles.labelDefault
        )}
      >
        {label}
      </p>
    </Root>
  );
}

export default StatCard;