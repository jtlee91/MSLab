export default function CagesPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>케이지 관리</h1>

            <div style={{
                backgroundColor: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <p style={{ color: 'var(--color-gray-500)' }}>
                    케이지 그리드가 여기에 표시됩니다.
                </p>

                {/* Rack Tabs Placeholder */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    marginTop: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--color-gray-200)',
                    paddingBottom: 'var(--spacing-sm)'
                }}>
                    {['랙1', '랙2', '랙3'].map((rack, idx) => (
                        <button
                            key={rack}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                backgroundColor: idx === 0 ? 'var(--color-primary)' : 'transparent',
                                color: idx === 0 ? 'var(--color-white)' : 'var(--color-gray-700)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                fontWeight: 'var(--font-weight-medium)'
                            }}
                        >
                            {rack}
                        </button>
                    ))}
                </div>

                {/* Grid Placeholder */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(8, 1fr)',
                    gap: 'var(--spacing-xs)',
                    marginTop: 'var(--spacing-lg)'
                }}>
                    {Array.from({ length: 64 }).map((_, idx) => (
                        <div
                            key={idx}
                            style={{
                                aspectRatio: '1',
                                backgroundColor: idx % 7 === 0 ? 'var(--color-primary-light)' : 'var(--color-gray-100)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px dashed var(--color-gray-300)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-gray-500)'
                            }}
                        >
                            {String.fromCharCode(65 + Math.floor(idx / 8))}{(idx % 8) + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
