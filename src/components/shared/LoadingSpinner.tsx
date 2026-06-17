import styles from "./LoadingSpinner.module.css";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
};

const LoadingSpinner = ({
  size = "md",
  fullScreen = false,
}: LoadingSpinnerProps) => {

  const spinner = (
    <div className={styles.spinnerWrapper}>
      <div
        className={`${styles.spinner} ${styles[size]}`}
      />
      {size === "lg" && (
        <p className={styles.loadingText}>Loading...</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen}>
        {spinner}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {spinner}
    </div>
  );
};

export default LoadingSpinner;