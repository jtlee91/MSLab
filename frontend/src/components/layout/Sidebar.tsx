import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    path: string;
    icon: string;
    label: string;
}

const navItems: NavItem[] = [
    { path: '/', icon: '🏠', label: '케이지 관리' },
    { path: '/dashboard', icon: '📊', label: '대시보드' },
    { path: '/settings', icon: '⚙️', label: '설정' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`${styles.sidebar__overlay} ${isOpen ? styles['sidebar__overlay--visible'] : ''}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles['sidebar--open'] : ''}`}>
                <div className={styles.sidebar__header}>
                    <h1 className={styles.sidebar__logo}>MSLab</h1>
                </div>

                <nav className={styles.sidebar__nav}>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `${styles.sidebar__navItem} ${isActive ? styles['sidebar__navItem--active'] : ''}`
                            }
                            onClick={onClose}
                            end={item.path === '/'}
                        >
                            <span className={styles.sidebar__icon}>{item.icon}</span>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.sidebar__footer}>
                    <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-gray-500)' }}>
                        v0.1.0
                    </div>
                </div>
            </aside>
        </>
    );
}
