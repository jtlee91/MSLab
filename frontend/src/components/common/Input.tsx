import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Input label */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, className, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

        const inputClassNames = [
            styles.input,
            error && styles['input--error'],
            className,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={styles.inputWrapper}>
                {label && (
                    <label htmlFor={inputId} className={styles.label}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={inputClassNames}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    {...props}
                />
                {error && (
                    <span id={`${inputId}-error`} className={styles.errorMessage}>
                        {error}
                    </span>
                )}
                {helperText && !error && (
                    <span className={styles.helperText}>{helperText}</span>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
