import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';
import styles from './AuthPage.module.css';

export default function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, user } = useAuth();
    const activeTab: 'login' | 'register' = location.pathname === '/register' ? 'register' : 'login';

    useEffect(() => {
        if (isLoggedIn) {
            navigate(user?.role === 'owner' ? '/dashboard/owner' : '/', { replace: true });
        }
    }, [isLoggedIn, navigate, user]);

    return (
        <div className={styles.pageContainer}>
            <div className={styles.leftSide}>
                <div className={styles.logoContainer}>
                    <span className={styles.logoText}>
                        PicklePad
                    </span>
                    <span className={styles.logoBadge}>
                        AHM
                    </span>
                </div>

                <div className={styles.titleContainer}>
                    <h1 className={styles.titleLine}>
                        AHMEDABAD'S
                    </h1>
                    <h1 className={styles.titleLineItalic}>
                        Only
                    </h1>
                    <h1 className={styles.titleLine}>
                        PICKLEBALL
                    </h1>
                    <h1 className={styles.titleLine}>
                        PLATFORM.
                    </h1>
                </div>

                <div>
                    <p className={styles.footerText}>
                        Made with <span className={styles.heart}>&#10084;</span> for Ahmedabad
                    </p>
                </div>
            </div>

            <div className={styles.rightSide}>
                <div className={styles.ambientGlows}>
                    <div className={styles.glowTopRight} />
                    <div className={styles.glowBottomLeft} />
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.mobileHeader}>
                        <h1 className={styles.mobileTitle}>
                            Welcome to Pickle<span className={styles.mobileTitleHighlight}>Pad</span>
                        </h1>
                        <p className={styles.mobileSubtitle}>
                            Ahmedabad&apos;s Premier Pickleball Platform
                        </p>
                    </div>

                    <div className={styles.tabsContainer}>
                        <button
                            onClick={() => navigate('/login')}
                            className={`${styles.tab} ${activeTab === 'login' ? styles.tabActive : styles.tabInactive}`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className={`${styles.tab} ${activeTab === 'register' ? styles.tabActive : styles.tabInactive}`}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>
                            {activeTab === 'login' ? 'WELCOME BACK' : 'JOIN THE GAME'}
                        </h2>
                        <p className={styles.formSubtitle}>
                            {activeTab === 'login'
                                ? 'Sign in to book your court.'
                                : 'Create your account to get started.'}
                        </p>
                    </div>

                    <div className={styles.formCard}>
                        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
                    </div>

                    <p className={styles.footer}>
                        {activeTab === 'login' ? (
                            <>
                                Don&apos;t have an account?{' '}
                                <button
                                    onClick={() => navigate('/register')}
                                    className={styles.footerLink}
                                >
                                    Create one
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className={styles.footerLink}
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}