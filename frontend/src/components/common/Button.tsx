import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Button visual variant */
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    /** Button size */
    size?: 'small' | 'medium' | 'large';
    /** Full width button */
    fullWidth?: boolean;
    /** Loading state */
    loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'medium',
            fullWidth = false,
            loading = false,
            disabled,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const classNames = [
            styles.button,
            styles[`button--${variant}`],
            size !== 'medium' && styles[`button--${size}`],
            fullWidth && styles['button--fullWidth'],
            loading && styles['button--loading'],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <button
                ref={ref}
                className={classNames}
                disabled={disabled || loading}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
