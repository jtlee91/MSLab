import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AppLayout.module.css';

const pageTitles: Record<string, string> = {
    '/': '케이지 관리',
    '/dashboard': '대시보드',
    '/settings': '설정',
};

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const title = pageTitles[location.pathname] || '케이지 관리';

    return (
        <div className={styles.layout}>
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={styles.layout__content}>
                <Header title={title} onMenuClick={() => setSidebarOpen(true)} />

                <main className={styles.layout__main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
