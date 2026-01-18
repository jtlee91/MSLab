import './App.css'

function App() {
  return (
    <div style={{ padding: 'var(--spacing-xl)' }}>
      <h1>MSLab 케이지 관리</h1>
      <p style={{ marginTop: 'var(--spacing-md)' }}>
        디자인 시스템이 적용된 케이지 관리 서비스입니다.
      </p>

      {/* Design System Demo */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>색상 팔레트</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--font-size-caption)' }}>Primary</div>
          <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--font-size-caption)' }}>Success</div>
          <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-warning)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--font-size-caption)' }}>Warning</div>
          <div style={{ width: 80, height: 80, backgroundColor: 'var(--color-error)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--font-size-caption)' }}>Error</div>
        </div>
      </section>

      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>타이포그래피</h2>
        <div style={{ marginTop: 'var(--spacing-md)' }}>
          <h1>Heading 1 - 페이지 제목</h1>
          <h2>Heading 2 - 섹션 제목</h2>
          <h3>Heading 3 - 카드 제목</h3>
          <p>Body - 본문 텍스트입니다. Pretendard 폰트가 적용되어 있습니다.</p>
          <small>Caption - 힌트, 라벨</small>
        </div>
      </section>
    </div>
  )
}

export default App
