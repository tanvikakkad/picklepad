import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import { initializeStore } from './store';
import styles from './App.module.css'; 

export default function App() {
  useEffect(() => {
    initializeStore();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        containerClassName={styles.toaster}
        toastOptions={{
          duration: 3000,
          className: styles.toastBase,
          success: {
            iconTheme: { primary: '#C8F135', secondary: '#0A0A0A' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}
