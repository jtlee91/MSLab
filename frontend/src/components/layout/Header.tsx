import styles from './Header.module.css';

interface HeaderProps {
    title: string;
    onMenuClick: () => void;
}

export default function Header({ title, onMenuClick }: HeaderProps) {
    return (
        <header className={styles.header}>
            <button
                className={styles.header__menuButton}
                onClick={onMenuClick}
                aria-label="메뉴 열기"
            >
                ☰
            </button>

            <h2 className={styles.header__title}>{title}</h2>

            <div className={styles.header__spacer} />

            <div className={styles.header__user}>
                <div className={styles.header__avatar}>관</div>
                <span>관리자</span>
            </div>
        </header>
    );
}
