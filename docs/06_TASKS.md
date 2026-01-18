# TASKS: AI 개발 파트너용 태스크

> **문서 버전**: v1.1 | **작성일**: 2026-01-18 | **최종 수정**: 2026-01-18

---

## M0: 프로젝트 초기화 및 기술 스택 설정

### [x] M0-1: 개발 환경 구성

**컨텍스트**: 프론트엔드(React+Vite)와 백엔드(FastAPI)를 위한 개발 환경을 구성합니다.

**기술 명세**:
- 프론트엔드: React 18, Vite, TypeScript
- 백엔드: Python 3.11+, FastAPI, SQLAlchemy, SQLite
- 참조: [02_TRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/02_TRD.md)

**인수 조건**:
- [x] `frontend/` 폴더에 Vite+React 프로젝트 생성
- [x] `backend/` 폴더에 FastAPI 프로젝트 생성
- [x] 로컬에서 프론트/백엔드 동시 실행 가능
- [x] `.env.example` 파일 생성

**자가 수정 지침**: 의존성 설치 오류 시 버전 호환성 확인 후 재시도

---

### [x] M0-2: 데이터베이스 스키마 생성

**컨텍스트**: SQLite 데이터베이스와 테이블을 생성합니다.

**기술 명세**:
- SQLAlchemy ORM 모델 정의
- Alembic 마이그레이션 설정
- 참조: [04_DatabaseDesign.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/04_DatabaseDesign.md)

**인수 조건**:
- [x] users, racks, professors, cages, assignments 모델 생성
- [x] 초기 마이그레이션 실행
- [x] Seed 데이터(기본 랙 3개, 관리자 계정) 생성

---

## M1: 핵심 UI 및 디자인 시스템 구축

### [x] M1-1: CSS 변수 및 글로벌 스타일 설정

**컨텍스트**: 디자인 시스템을 CSS 변수로 구현합니다.

**기술 명세**:
- 참조: [05_DesignSystem.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/05_DesignSystem.md)
- Pretendard 폰트 적용

**인수 조건**:
- [x] CSS 변수 (colors, spacing, typography) 정의
- [x] 글로벌 reset CSS 적용

---

### [x] M1-2: 공통 컴포넌트 생성

**컨텍스트**: 버튼, 입력필드, 토스트, 모달 등 재사용 컴포넌트를 만듭니다.

**인수 조건**:
- [x] Button 컴포넌트 (Primary, Secondary, Ghost)
- [x] Input 컴포넌트
- [x] Toast 컴포넌트 (성공, 경고, 오류)
- [x] Modal 컴포넌트

---

### [x] M1-3: 레이아웃 및 네비게이션

**컨텍스트**: 앱의 전체 레이아웃과 네비게이션 구조를 구현합니다.

**인수 조건**:
- [x] 사이드바 (관리자용) 또는 탭바 (모바일)
- [x] 반응형 레이아웃 (Desktop/Tablet/Mobile)
- [x] 라우팅 설정 (케이지관리, 대시보드, 설정)

---

## M2: 인증 및 사용자 관리

### [] M2-1: 로그인/회원가입 API

**사용자 스토리**: 사용자로서, 이메일과 비밀번호로 로그인하고 싶다.

**기술 명세**:
- JWT 토큰 (Access 15분, Refresh 7일)
- bcrypt 비밀번호 해싱
- 참조: [02_TRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/02_TRD.md) 보안 섹션

**인수 조건**:
- [ ] POST /api/auth/login
- [ ] POST /api/auth/register
- [ ] POST /api/auth/refresh
- [ ] 역할 기반 접근 제어 (admin/researcher)

---

### [] M2-2: 로그인 화면 UI

**인수 조건**:
- [ ] 이메일/비밀번호 입력 폼
- [ ] 로그인 버튼
- [ ] 오류 메시지 표시
- [ ] 로그인 성공 시 메인 화면으로 리다이렉트

---

## M3: 핵심 기능 개발 (MVP)

### [x] M3-1: FEAT-1 케이지 그리드 API

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.1 ~ US-1.3

**기술 명세**:
- Optimistic Locking (version 필드)
- 참조: [02_TRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/02_TRD.md) 동시성 처리 섹션

**인수 조건**:
- [x] GET /api/racks - 랙 목록
- [x] GET /api/racks/{id}/cages - 케이지 그리드
- [x] POST /api/cages/{id}/assign - 배정 (version 검증)
- [x] POST /api/cages/{id}/release - 해제 (version 검증)
- [x] 409 Conflict 응답 시 충돌 처리

---

### [x] M3-2: FEAT-1 케이지 그리드 UI

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.1 ~ US-1.3
**흐름**: [03_UserFlow.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/03_UserFlow.md) FEAT-1 섹션

**인수 조건**:
- [x] 랙 탭 전환 (랙1/랙2/랙3) - `RackTabs.tsx`
- [x] 그리드 형태 케이지 표시 (색상으로 교수 구분) - `CageGrid.tsx`, `CageCell.tsx`
- [x] 빈 케이지 **클릭** → 교수 선택 팝업 → 즉시 배정 (모바일 지원을 위해 더블클릭→클릭으로 변경)
- [x] 사용 중 케이지 클릭 → "사용 종료?" 확인 → 해제 - `ConfirmReleaseModal.tsx`
- [x] 5초 폴링으로 최신 데이터 반영 - `useCageGrid.ts`
- [x] 충돌 시 알림 + 자동 새로고침 (409 응답 처리)

**구현 파일**:
- `frontend/src/pages/CagesPage.tsx` - 메인 페이지
- `frontend/src/hooks/useCageGrid.ts` - 상태 관리 훅
- `frontend/src/components/cages/*` - UI 컴포넌트

---

### [x] M3-3: 설정 - 랙 관리

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.4

**인수 조건**:
- [x] 랙 목록 조회 (`GET /api/racks` - 사용 중 케이지 수 포함)
- [x] 랙 추가 (이름, 행, 열) - 케이지 자동 생성
- [x] 랙 수정 - 크기 확대/축소 지원 (축소 시 배정된 케이지 체크)
- [x] 랙 삭제 (케이지 배정 없을 때만 - UI에서 삭제 버튼 비활성화)

**구현 파일**:
- `backend/app/api/routes/racks.py` - CRUD API
- `frontend/src/components/settings/RackSettings.tsx` - 메인 UI
- `frontend/src/components/settings/RackFormModal.tsx` - 추가/수정 모달
- `frontend/src/components/settings/ConfirmDeleteModal.tsx` - 삭제 확인 모달

**추가 구현 사항**:
- 랙별 사용 중 케이지 수 표시 (뱃지)
- 케이지가 배정된 랙은 삭제 버튼 비활성화
- 랙 크기 변경 시 기존 데이터 유지 (필요한 케이지만 추가/삭제)
- 크기 축소 시 삭제될 영역에 배정된 케이지가 있으면 에러 메시지 표시

---

### [x] M3-4: 설정 - 교수 관리

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.5

**인수 조건**:
- [x] 교수 목록 조회 (`GET /api/professors` - 사용 중 케이지 수 포함)
- [x] 교수 추가 (이름, 담당학생, 연락처, 색상) - 8가지 프리셋 + 커스텀 색상
- [x] 교수 수정
- [x] 교수 삭제 (케이지 배정 없을 때만 - UI에서 삭제 버튼 비활성화)

**구현 파일**:
- `backend/app/api/routes/professors.py` - CRUD API
- `backend/app/schemas/professor.py` - ProfessorUpdate, ProfessorActionResponse 스키마
- `frontend/src/components/settings/ProfessorSettings.tsx` - 메인 UI
- `frontend/src/components/settings/ProfessorFormModal.tsx` - 추가/수정 모달

**추가 구현 사항**:
- 교수별 사용 중 케이지 수 표시 (뱃지)
- 케이지가 배정된 교수는 삭제 버튼 비활성화
- 8가지 프리셋 색상 및 커스텀 색상 선택 지원

---

## M4: 2차 기능 (MVP 이후)

### [x] M4-1: FEAT-2 대시보드 API

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-2.1 ~ US-2.3

**인수 조건**:
- [x] GET /api/dashboard/summary - 랙별 사용 현황
- [x] GET /api/dashboard/professors - 교수별 사용 현황
- [x] GET /api/dashboard/costs?period=daily|weekly|monthly - 비용 차트 데이터

**구현 파일**:
- `backend/app/api/routes/dashboard.py` - 대시보드 API 라우트
- `backend/app/schemas/dashboard.py` - 응답 스키마 정의

**API 응답 구조**:
- `/summary`: 전체/랙별 케이지 사용 현황 (총 케이지, 사용 중, 사용 가능, 사용률)
- `/professors`: 교수별 현재 사용 중인 케이지 수 (사용량 내림차순 정렬)
- `/costs`: 기간별 비용 데이터 (daily: 7일, weekly: 4주, monthly: 90일)

---

### [x] M4-2: FEAT-2 대시보드 UI

**인수 조건**:
- [x] 랙별 사용/미사용 카드
- [x] 교수별 사용 케이지 수 리스트
- [x] 일/주/월 비용 차트 (Recharts)

**구현 파일**:
- `frontend/src/pages/DashboardPage.tsx` - 대시보드 메인 페이지
- `frontend/src/components/dashboard/SummaryCards.tsx` - 요약 카드 및 랙별 현황
- `frontend/src/components/dashboard/ProfessorUsageList.tsx` - 교수별 사용 현황
- `frontend/src/components/dashboard/CostChart.tsx` - 비용 차트 (Recharts)

**UI 구성**:
- 상단: 전체 케이지/사용 중/빈 케이지/오늘 비용 요약 카드
- 중단: 랙별 현황 카드 (사용률 프로그레스 바)
- 하단: 교수별 사용 현황 (가로 막대), 비용 차트 (기간별 누적 막대)

---

### [x] M4-3: FEAT-3 리포트 다운로드

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-3.1 ~ US-3.2

**인수 조건**:
- [x] 기간 선택 UI (시작일/종료일 + 프리셋 버튼)
- [x] GET /api/reports/download?start=&end= - xlsx 생성 및 다운로드
- [x] xlsx 시트 구성: [요약], [상세]

**구현 파일**:
- `backend/app/api/routes/reports.py` - xlsx 생성 및 다운로드 API (openpyxl)
- `frontend/src/components/dashboard/ReportDownload.tsx` - 기간 선택 및 다운로드 UI

**xlsx 시트 구성**:
- [요약] 시트: 교수명, 담당 학생, 사용 케이지 수, 총 비용, 합계
- [상세] 시트: 날짜, 랙, 케이지 위치, 교수명, 담당 학생, 비용

---

## M5: 테스트 및 배포

### [] M5-1: 테스트 시나리오 실행

**인수 조건**:
- [ ] 케이지 배정/해제 정상 동작
- [ ] 동시 수정 충돌 처리 확인
- [ ] 모바일 반응형 확인

---

### [] M5-2: 배포 파이프라인 구성

**인수 조건**:
- [ ] 프론트엔드 Vercel 배포
- [ ] 백엔드 Railway/Fly.io 배포
- [ ] 환경 변수 설정
- [ ] 도메인 연결 (선택)
