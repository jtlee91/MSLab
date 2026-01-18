import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

const TOAST_ICONS: Record<ToastType, string> = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
};

const TOAST_DURATION = 3000;

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((type: ToastType, message: string) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, TOAST_DURATION);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`${styles.toast} ${styles[`toast--${toast.type}`]}`}
                        role="alert"
                    >
                        <span className={styles.toast__icon}>{TOAST_ICONS[toast.type]}</span>
                        <span className={styles.toast__message}>{toast.message}</span>
                        <button
                            className={styles.toast__close}
                            onClick={() => removeToast(toast.id)}
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
