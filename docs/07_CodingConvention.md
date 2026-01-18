# Coding Convention & AI Collaboration Guide

> **문서 버전**: v1.0 | **작성일**: 2026-01-18

---

## 1. 핵심 원칙

> **"신뢰하되, 검증하라"** (Trust, but Verify)

| 원칙 | 설명 |
|------|------|
| AI 생성 코드 검토 | 모든 AI 생성 코드는 실행 전 검토 |
| 점진적 구현 | 작은 단위로 구현하고 테스트 |
| 문서 참조 | PRD, TRD 등 기획 문서를 항상 참조 |

---

## 2. 프로젝트 구조

### 2.1 프론트엔드 (React + Vite)

```
frontend/
├── src/
│   ├── components/    # 재사용 UI 컴포넌트
│   │   ├── common/    # Button, Input, Modal, Toast
│   │   └── cage/      # CageGrid, CageCell
│   ├── pages/         # 페이지 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── api/           # API 호출 함수
│   ├── styles/        # 글로벌 CSS, 변수
│   └── utils/         # 유틸리티 함수
├── .env.example
└── package.json
```

### 2.2 백엔드 (FastAPI)

```
backend/
├── app/
│   ├── api/           # 라우터
│   │   ├── auth.py
│   │   ├── cages.py
│   │   └── reports.py
│   ├── models/        # SQLAlchemy 모델
│   ├── schemas/       # Pydantic 스키마
│   ├── services/      # 비즈니스 로직
│   ├── core/          # 설정, 보안
│   └── main.py
├── alembic/           # 마이그레이션
├── .env.example
└── requirements.txt
```

---

## 3. 코드 스타일

### 3.1 공통

| 항목 | 규칙 |
|------|------|
| 들여쓰기 | 2칸 (프론트), 4칸 (백엔드) |
| 문자열 | 작은따옴표 (JS), 큰따옴표 (Python) |
| 파일명 | kebab-case (컴포넌트), snake_case (Python) |

### 3.2 TypeScript/React

```typescript
// 컴포넌트: PascalCase, 함수형
const CageCell: React.FC<CageCellProps> = ({ cage, onAssign }) => {
  // ...
};

// 훅: camelCase, use 접두사
const useCageGrid = (rackId: number) => {
  // ...
};
```

### 3.3 Python/FastAPI

```python
# 함수/변수: snake_case
def assign_cage(cage_id: int, professor_id: int) -> CageResponse:
    pass

# 클래스: PascalCase
class CageService:
    pass
```

---

## 4. 보안 체크리스트

| 항목 | 확인 |
|------|------|
| `.env` 파일 `.gitignore`에 포함 | ☐ |
| 비밀번호 bcrypt 해싱 | ☐ |
| JWT 시크릿 환경변수 사용 | ☐ |
| CORS 화이트리스트 설정 | ☐ |
| SQL Injection 방지 (ORM 사용) | ☐ |

### 4.1 환경 변수

```env
# .env.example
DATABASE_URL=sqlite:///./app.db
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
CORS_ORIGINS=http://localhost:5173
```

---

## 5. 테스트 가이드

### 5.1 테스트 시나리오

| 기능 | 테스트 항목 |
|------|-------------|
| 케이지 배정 | 빈 케이지 클릭 → 교수 선택 → 성공 |
| 케이지 해제 | 사용 중 클릭 → 확인 → 해제 |
| 충돌 처리 | 두 사용자 동시 수정 → 나중 사용자에게 알림 |
| 반응형 | 모바일에서 그리드 조작 가능 |

### 5.2 검증 워크플로우

1. 로컬에서 기능 구현
2. 콘솔 오류 확인
3. 시나리오별 수동 테스트
4. 모바일 브라우저에서 확인

---

## 6. AI 협업 가이드

### 6.1 효과적인 프롬프트

**좋은 예시**:
```
TASKS.md의 M3-2 태스크를 구현해줘.
- PRD.md US-1.1 사용자 스토리 참조
- UserFlow.md FEAT-1 섹션의 흐름대로
- DesignSystem.md 케이지 셀 스타일 적용
- 인수 조건 체크리스트 확인
```

**피해야 할 예시**:
```
케이지 그리드 만들어줘 (컨텍스트 부족)
```

### 6.2 컨텍스트 제공

| 항목 | 참조 문서 |
|------|-----------|
| 기능 요구사항 | PRD.md |
| 기술 명세 | TRD.md |
| 사용자 흐름 | UserFlow.md |
| 데이터 구조 | DatabaseDesign.md |
| UI 스타일 | DesignSystem.md |
| 태스크 목록 | TASKS.md |

### 6.3 자가 수정 루프

1. AI가 코드 생성
2. 인수 조건 체크
3. 누락/오류 발견 시 피드백
4. AI가 수정
5. 반복

---

## 7. 버전 관리

### 7.1 커밋 메시지

```
feat: 케이지 배정 API 구현
fix: 충돌 시 409 응답 처리
docs: README 업데이트
style: 코드 포맷팅
```

### 7.2 브랜치

| 브랜치 | 용도 |
|--------|------|
| main | 배포 가능 버전 |
| develop | 개발 통합 |
| feature/* | 기능 개발 |
