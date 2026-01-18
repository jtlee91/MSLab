export default function DashboardPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>대시보드</h1>

            {/* Summary Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                {[
                    { label: '전체 케이지', value: '192', icon: '📦' },
                    { label: '사용 중', value: '67', icon: '✅' },
                    { label: '빈 케이지', value: '125', icon: '⬜' },
                    { label: '오늘 비용', value: '53,600원', icon: '💰' },
                ].map((card) => (
                    <div
                        key={card.label}
                        style={{
                            backgroundColor: 'var(--color-white)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <div style={{ fontSize: '24px', marginBottom: 'var(--spacing-sm)' }}>{card.icon}</div>
                        <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-gray-500)' }}>{card.label}</div>
                        <div style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-gray-900)' }}>{card.value}</div>
                    </div>
                ))}
            </div>

            <div style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>교수별 사용 현황</h3>
                <p style={{ color: 'var(--color-gray-500)' }}>
                    차트가 여기에 표시됩니다.
                </p>
            </div>
        </div>
    );
}
