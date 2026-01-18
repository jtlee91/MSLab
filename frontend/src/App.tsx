import { useState } from 'react';
import { Button, Input, Modal, ToastProvider, useToast } from './components/common';
import './App.css';

function ComponentDemo() {
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (e.target.value.length < 2) {
      setInputError('최소 2자 이상 입력하세요');
    } else {
      setInputError('');
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: 800, margin: '0 auto' }}>
      <h1>MSLab 컴포넌트 라이브러리</h1>

      {/* Button Section */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Button</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap', marginTop: 'var(--spacing-md)' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      </section>

      {/* Input Section */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Input</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)', maxWidth: 300 }}>
          <Input
            label="이름"
            placeholder="이름을 입력하세요"
            value={inputValue}
            onChange={handleInputChange}
            error={inputError}
          />
          <Input
            label="이메일"
            type="email"
            placeholder="email@example.com"
            helperText="업무용 이메일을 입력하세요"
          />
          <Input
            label="비활성화"
            disabled
            value="수정 불가"
          />
        </div>
      </section>

      {/* Toast Section */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Toast</h2>
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
          <Button onClick={() => showToast('success', '저장되었습니다')}>Success</Button>
          <Button variant="secondary" onClick={() => showToast('warning', '변경사항이 있습니다')}>Warning</Button>
          <Button variant="danger" onClick={() => showToast('error', '오류가 발생했습니다')}>Error</Button>
          <Button variant="ghost" onClick={() => showToast('info', '새로운 알림이 있습니다')}>Info</Button>
        </div>
      </section>

      {/* Modal Section */}
      <section style={{ marginTop: 'var(--spacing-xl)' }}>
        <h2>Modal</h2>
        <Button onClick={() => setIsModalOpen(true)}>모달 열기</Button>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="교수 선택"
          footer={
            <>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>취소</Button>
              <Button onClick={() => { setIsModalOpen(false); showToast('success', '선택 완료'); }}>확인</Button>
            </>
          }
        >
          <p>케이지를 배정할 교수를 선택하세요.</p>
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            {['김교수', '이교수', '박교수'].map((name) => (
              <div
                key={name}
                style={{
                  padding: 'var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  marginBottom: 'var(--spacing-sm)',
                  backgroundColor: 'var(--color-gray-50)',
                }}
              >
                {name}
              </div>
            ))}
          </div>
        </Modal>
      </section>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <ComponentDemo />
    </ToastProvider>
  );
}

export default App;
