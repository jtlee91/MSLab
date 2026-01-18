# Coding Convention & AI Collaboration Guide

> **문서 버전**: v1.1 | **작성일**: 2026-01-18 | **최종 수정**: 2026-01-18

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
│   ├── components/           # 재사용 UI 컴포넌트
│   │   ├── common/           # Button, Input, Modal, Toast (공통)
│   │   ├── cages/            # RackTabs, CageGrid, CageCell, ProfessorSelectModal, ConfirmReleaseModal
│   │   ├── dashboard/        # SummaryCards, ProfessorUsageList, CostChart, ReportDownload
│   │   ├── layout/           # AppLayout, Header, Sidebar
│   │   └── settings/         # RackSettings, RackFormModal, ProfessorSettings, ProfessorFormModal, ConfirmDeleteModal
│   ├── pages/                # 페이지 컴포넌트
│   │   ├── CagesPage.tsx     # 케이지 관리 (메인)
│   │   ├── DashboardPage.tsx # 대시보드
│   │   └── SettingsPage.tsx  # 설정 (랙/교수 관리)
│   ├── hooks/                # 커스텀 훅
│   │   └── useCageGrid.ts    # 케이지 그리드 상태 관리 (4초 폴링)
│   ├── services/             # API 호출 함수
│   │   └── api.ts            # rackApi, cageApi, professorApi, dashboardApi, reportApi
│   ├── types/                # TypeScript 타입 정의
│   │   └── index.ts          # 전체 인터페이스 정의
│   ├── index.css             # 글로벌 CSS (디자인 시스템 변수)
│   ├── App.tsx               # 앱 진입점 (라우터 설정)
│   └── main.tsx              # React 렌더링
├── package.json
└── vite.config.ts
```

### 2.2 백엔드 (FastAPI)

```
backend/
├── app/
│   ├── api/
│   │   └── routes/           # API 라우터
│   │       ├── cages.py      # 케이지 배정/해제 API
│   │       ├── racks.py      # 랙 CRUD API
│   │       ├── professors.py # 교수 CRUD API
│   │       ├── dashboard.py  # 대시보드 API (summary, professors, costs)
│   │       └── reports.py    # xlsx 다운로드 API
│   ├── models/               # SQLAlchemy ORM 모델
│   │   ├── base.py           # TimestampMixin
│   │   ├── user.py           # 사용자 모델
│   │   ├── rack.py           # 랙 모델
│   │   ├── cage.py           # 케이지 모델
│   │   ├── professor.py      # 교수 모델
│   │   └── assignment.py     # 배정 기록 모델
│   ├── schemas/              # Pydantic 스키마
│   │   ├── cage.py           # 케이지 관련 스키마 (CageResponse, AssignRequest, etc.)
│   │   ├── rack.py           # 랙 관련 스키마 (RackCreate, RackUpdate, etc.)
│   │   ├── professor.py      # 교수 관련 스키마 (ProfessorCreate, ProfessorUpdate, etc.)
│   │   └── dashboard.py      # 대시보드 스키마 (RackSummary, ProfessorUsage, DailyCost, etc.)
│   ├── config.py             # 설정 (환경 변수)
│   ├── database.py           # DB 연결
│   ├── seed.py               # 초기 데이터 시드
│   └── main.py               # FastAPI 앱 진입점 (/api 프리픽스)
├── alembic/                  # DB 마이그레이션
│   └── versions/             # 마이그레이션 스크립트
├── pyproject.toml            # Python 의존성 (uv)
├── start.sh                  # 시작 스크립트
└── mslab.db                  # SQLite 데이터베이스
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
interface CageCellProps {
  cage: Cage;
  onClick: (cage: Cage) => void;
}

function CageCell({ cage, onClick }: CageCellProps) {
  const handleClick = () => onClick(cage);
  return <button onClick={handleClick}>...</button>;
}

// memo로 불필요한 리렌더링 방지
export default memo(CageCell);

// 훅: camelCase, use 접두사
function useCageGrid(initialRackId?: number) {
  const [racks, setRacks] = useState<Rack[]>([]);
  const [selectedRackId, setSelectedRackId] = useState<number | null>(null);
  // ...
  return { racks, selectedRackId, ... };
}
```

### 3.3 Python/FastAPI

```python
# 라우터: APIRouter 사용
router = APIRouter(prefix="/cages", tags=["cages"])

# 엔드포인트: snake_case
@router.post("/{cage_id}/assign", response_model=CageActionResponse)
def assign_cage(
    cage_id: int,
    request: AssignRequest,
    db: Session = Depends(get_db),
):
    # Optimistic Locking 검증
    if cage.version != request.version:
        raise HTTPException(status_code=409, detail="Version mismatch")
    ...

# Pydantic 스키마: PascalCase
class CageResponse(BaseModel):
    id: int
    rack_id: int
    position: str
    version: int
    current_professor: Optional[ProfessorInfo] = None

    class Config:
        from_attributes = True
```

### 3.4 CSS Modules

```css
/* 컴포넌트명.module.css */
.container {
  padding: var(--spacing-lg);
}

/* BEM 스타일 네이밍 */
.cell { }
.cell--empty { }
.cell--assigned { }
.cell__position { }
.cell__professor { }

/* 모바일 반응형 */
@media (max-width: 640px) {
  .cell {
    min-height: 44px;
    touch-action: manipulation;
  }
}
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
