import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { MdSportsTennis } from 'react-icons/md';
import styles from './LoginForm.module.css';

interface LoginFormData {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
});

export default function LoginForm() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const returnUrl = (location.state as { from?: string })?.from || '/';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({ resolver: yupResolver(schema) });

    function onSubmit(data: LoginFormData) {
        const result = login(data.email, data.password);
        if (result.success) {
            toast.success('Welcome back!');
            toast(<MdSportsTennis />, { duration: 1500 });
            const redirect = result.role === 'owner' ? '/dashboard/owner' : returnUrl;
            navigate(redirect, { replace: true });
        } else {
            toast.error(result.error || 'Login failed');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.fieldGroup}>
                <label htmlFor="login-email" className={styles.label}>
                    Email Address
                </label>
                <div className={styles.inputWrapper}>
                    <HiMail className={styles.inputIcon} />
                    <input
                        id="login-email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        {...register('email')}
                        className={styles.input}
                    />
                </div>
                {errors.email && <p className={styles.error}>{errors.email.message}</p>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="login-password" className={styles.label}>
                    Password
                </label>
                <div className={styles.inputWrapper}>
                    <HiLockClosed className={styles.inputIcon} />
                    <input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        {...register('password')}
                        className={styles.input}
                    />
                </div>
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
            >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            <div className={styles.demoInfo}>
                <p className={styles.demoText}>
                    Demo: <span className={styles.demoHighlight}>player1@test.com</span> / <span className={styles.demoHighlight}>password123</span>
                </p>
            </div>
        </form>
    );
}
