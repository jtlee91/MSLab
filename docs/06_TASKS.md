# TASKS: AI 개발 파트너용 태스크

> **문서 버전**: v1.0 | **작성일**: 2026-01-18

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

### [] M3-1: FEAT-1 케이지 그리드 API

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.1 ~ US-1.3

**기술 명세**:
- Optimistic Locking (version 필드)
- 참조: [02_TRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/02_TRD.md) 동시성 처리 섹션

**인수 조건**:
- [ ] GET /api/racks - 랙 목록
- [ ] GET /api/racks/{id}/cages - 케이지 그리드
- [ ] POST /api/cages/{id}/assign - 배정 (version 검증)
- [ ] POST /api/cages/{id}/release - 해제 (version 검증)
- [ ] 409 Conflict 응답 시 충돌 처리

---

### [] M3-2: FEAT-1 케이지 그리드 UI

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.1 ~ US-1.3
**흐름**: [03_UserFlow.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/03_UserFlow.md) FEAT-1 섹션

**인수 조건**:
- [ ] 랙 탭 전환 (랙1/랙2/랙3)
- [ ] 그리드 형태 케이지 표시 (색상으로 교수 구분)
- [ ] 빈 케이지 더블클릭 → 교수 선택 팝업 → 즉시 배정
- [ ] 사용 중 케이지 클릭 → "사용 종료?" 확인 → 해제
- [ ] 3~5초 폴링으로 최신 데이터 반영
- [ ] 충돌 시 알림 + 자동 새로고침

---

### [] M3-3: 설정 - 랙 관리

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.4

**인수 조건**:
- [ ] 랙 목록 조회
- [ ] 랙 추가 (이름, 행, 열)
- [ ] 랙 수정
- [ ] 랙 삭제 (케이지 없을 때만)

---

### [] M3-4: 설정 - 교수 관리

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-1.5

**인수 조건**:
- [ ] 교수 목록 조회
- [ ] 교수 추가 (이름, 담당학생, 연락처, 색상)
- [ ] 교수 수정
- [ ] 교수 삭제 (배정 케이지 없을 때만)

---

## M4: 2차 기능 (MVP 이후)

### [] M4-1: FEAT-2 대시보드 API

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-2.1 ~ US-2.3

**인수 조건**:
- [ ] GET /api/dashboard/summary - 랙별 사용 현황
- [ ] GET /api/dashboard/professors - 교수별 사용 현황
- [ ] GET /api/dashboard/costs?period=daily|weekly|monthly - 비용 차트 데이터

---

### [] M4-2: FEAT-2 대시보드 UI

**인수 조건**:
- [ ] 랙별 사용/미사용 카드
- [ ] 교수별 사용 케이지 수 리스트
- [ ] 일/주/월 비용 차트 (Chart.js 또는 Recharts)

---

### [] M4-3: FEAT-3 리포트 다운로드

**사용자 스토리**: [01_PRD.md](file:///Users/jtlee/.gemini/antigravity/brain/0182e2fd-b223-4565-a570-acc207075130/01_PRD.md) US-3.1 ~ US-3.2

**인수 조건**:
- [ ] 기간 선택 UI
- [ ] GET /api/reports/download?start=&end= - xlsx 생성 및 다운로드
- [ ] xlsx 시트 구성: [요약], [상세]

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
