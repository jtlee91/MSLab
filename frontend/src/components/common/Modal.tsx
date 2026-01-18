import { useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

export interface ModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when the modal should close */
    onClose: () => void;
    /** Modal title */
    title?: string;
    /** Modal content */
    children: ReactNode;
    /** Footer content (usually buttons) */
    footer?: ReactNode;
    /** Whether to close on overlay click */
    closeOnOverlayClick?: boolean;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    footer,
    closeOnOverlayClick = true,
}: ModalProps) {
    // Handle ESC key
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        },
        [onClose]
    );

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div
            className={styles.overlay}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div className={styles.modal}>
                {title && (
                    <div className={styles.modal__header}>
                        <h2 id="modal-title" className={styles.modal__title}>
                            {title}
                        </h2>
                        <button
                            className={styles.modal__close}
                            onClick={onClose}
                            aria-label="닫기"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className={styles.modal__body}>{children}</div>
                {footer && <div className={styles.modal__footer}>{footer}</div>}
            </div>
        </div>,
        document.body
    );
}
