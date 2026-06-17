// Empty list placeholder
import { MdSearchOff } from "react-icons/md";
import type { IconType } from "react-icons";
import styles from "./EmptyState.module.css";


type EmptyStateAction = {
  label: string;
  onClick: () => void;
};

type EmptyStateProps = {
  icon?: IconType;
  title?: string;
  description?: string;
  action?: EmptyStateAction | null;
};

const EmptyState = ({
  icon: Icon = MdSearchOff,
  title = "Nothing Here",
  description = "Try again adjusting your search and filter",
  action = null,
}: EmptyStateProps) => {
  return (
    <div className={styles.container}>
      
      <div className={styles.iconCircle}>
        <Icon className={styles.icon} />
      </div>

      <h3 className={styles.title}>{title}</h3>

      <p className={styles.description}>{description}</p>

      {action && (
        <button
          onClick={action.onClick}
          className={styles.button}
        >
          {action.label}
        </button>
      )}

    </div>
  );
};

export default EmptyState;