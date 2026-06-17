import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiPhone } from 'react-icons/hi';
import { MdSportsTennis, MdBusinessCenter } from 'react-icons/md';
import { useState } from 'react';
import styles from './RegisterForm.module.css';

interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone?: string;
}

const schema = yup.object({
    name: yup.string().min(2, 'At least 2 characters').required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'At least 6 characters').required('Password is required'),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm your password'),
    phone: yup.string().matches(/^[0-9]{10}$/, 'Enter a valid 10-digit number').optional(),
});

export default function RegisterForm() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<'player' | 'owner'>('player');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({ resolver: yupResolver(schema) });

    function onSubmit(data: RegisterFormData) {
        const result = registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
            role: selectedRole,
            phone: data.phone,
        });

        if (result.success) {
            toast.success('Account created! Welcome to PicklePad');
            toast(<MdSportsTennis />, { duration: 1500 });
            navigate(result.role === 'owner' ? '/dashboard/owner' : '/', { replace: true });
        } else {
            toast.error(result.error || 'Registration failed');
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={styles.fieldGroup}>
                <label className={styles.roleLabel}>I want to...</label>
                <div className={styles.roleGrid}>
                    <button
                        type="button"
                        onClick={() => setSelectedRole('player')}
                        className={selectedRole === 'player' ? styles.roleBtnActive : styles.roleBtn}
                    >
                        <MdSportsTennis className={selectedRole === 'player' ? styles.roleIconActive : styles.roleIcon} />
                        <div className={selectedRole === 'player' ? styles.roleTitleActive : styles.roleTitle}>
                            Book Courts
                        </div>
                        <div className={styles.roleSubtitle}>Player</div>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedRole('owner')}
                        className={selectedRole === 'owner' ? styles.roleBtnActive : styles.roleBtn}
                    >
                        <MdBusinessCenter className={selectedRole === 'owner' ? styles.roleIconActive : styles.roleIcon} />
                        <div className={selectedRole === 'owner' ? styles.roleTitleActive : styles.roleTitle}>
                            List Courts
                        </div>
                        <div className={styles.roleSubtitle}>Venue Owner</div>
                    </button>
                </div>
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="register-name" className={styles.label}>Full Name</label>
                <div className={styles.inputWrapper}>
                    <HiUser className={styles.inputIcon} />
                    <input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        autoComplete="name"
                        {...register('name')}
                        className={styles.input}
                    />
                </div>
                {errors.name && <p className={styles.error}>{errors.name.message}</p>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="register-email" className={styles.label}>Email Address</label>
                <div className={styles.inputWrapper}>
                    <HiMail className={styles.inputIcon} />
                    <input
                        id="register-email"
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
                <label htmlFor="register-phone" className={styles.label}>Phone (optional)</label>
                <div className={styles.inputWrapper}>
                    <HiPhone className={styles.inputIcon} />
                    <input
                        id="register-phone"
                        type="tel"
                        placeholder="9876543210"
                        autoComplete="tel"
                        {...register('phone')}
                        className={styles.input}
                    />
                </div>
                {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="register-password" className={styles.label}>Password</label>
                <div className={styles.inputWrapper}>
                    <HiLockClosed className={styles.inputIcon} />
                    <input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register('password')}
                        className={styles.input}
                    />
                </div>
                {errors.password && <p className={styles.error}>{errors.password.message}</p>}
            </div>

            <div className={styles.fieldGroup}>
                <label htmlFor="register-confirm" className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                    <HiLockClosed className={styles.inputIcon} />
                    <input
                        id="register-confirm"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        className={styles.input}
                    />
                </div>
                {errors.confirmPassword && <p className={styles.error}>{errors.confirmPassword.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
            >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
        </form>
    );
}
