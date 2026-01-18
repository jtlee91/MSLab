export default function SettingsPage() {
    return (
        <div>
            <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>설정</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {/* Rack Settings */}
                <div style={{
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-xl)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>랙 관리</h3>
                    <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-md)' }}>
                        랙의 이름과 크기를 설정합니다.
                    </p>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                                <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-caption)' }}>이름</th>
                                <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-caption)' }}>행</th>
                                <th style={{ textAlign: 'left', padding: 'var(--spacing-sm)', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-caption)' }}>열</th>
                            </tr>
                        </thead>
                        <tbody>
                            {['랙1', '랙2', '랙3'].map((rack) => (
                                <tr key={rack} style={{ borderBottom: '1px solid var(--color-gray-100)' }}>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>{rack}</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>8</td>
                                    <td style={{ padding: 'var(--spacing-sm)' }}>8</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Professor Settings */}
                <div style={{
                    backgroundColor: 'var(--color-white)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-xl)',
                    boxShadow: 'var(--shadow-sm)'
                }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>교수 관리</h3>
                    <p style={{ color: 'var(--color-gray-500)', marginBottom: 'var(--spacing-md)' }}>
                        교수 정보를 관리합니다.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        {[
                            { name: '김교수', color: '#EF4444' },
                            { name: '이교수', color: '#3B82F6' },
                            { name: '박교수', color: '#10B981' },
                        ].map((prof) => (
                            <div
                                key={prof.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-sm)',
                                    padding: 'var(--spacing-sm)',
                                    backgroundColor: 'var(--color-gray-50)',
                                    borderRadius: 'var(--radius-md)'
                                }}
                            >
                                <div style={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: 'var(--radius-sm)',
                                    backgroundColor: prof.color
                                }} />
                                {prof.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
