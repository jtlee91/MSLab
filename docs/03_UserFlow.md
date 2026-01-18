# User Flow: 연구실 케이지 관리 서비스

> **문서 버전**: v1.0  
> **작성일**: 2026-01-18  
> **상태**: 초안

---

## 1. 전체 사용자 여정

```mermaid
graph TD
    subgraph 온보딩
        A[서비스 접속] --> B{로그인 상태?}
        B -->|No| C[로그인 페이지]
        C --> D[이메일/비밀번호 입력]
        D --> E{인증 성공?}
        E -->|No| F[오류 메시지]
        F --> D
        E -->|Yes| G[메인 화면]
        B -->|Yes| G
    end

    subgraph 핵심작업
        G --> H{사용자 역할?}
        H -->|연구원| I[케이지 관리 화면]
        H -->|관리자| J[대시보드]
        J --> I
        J --> K[설정]
        J --> L[리포트]
    end

    subgraph 리텐션
        I --> M[빠른 재접속]
        L --> M
        M --> G
    end

    style G fill:#4CAF50,color:#fff
    style I fill:#2196F3,color:#fff
    style J fill:#9C27B0,color:#fff
```

---

## 2. FEAT-1: 케이지 배정 흐름

### 2.1 빈 케이지 → 교수 배정

```mermaid
graph TD
    A[케이지 그리드 화면] --> B[빈 케이지 더블클릭/터치]
    B --> C[교수 선택 팝업 표시]
    C --> D{교수 선택?}
    D -->|선택함| E[서버에 배정 요청]
    D -->|취소/바깥 클릭| A
    
    E --> F{서버 응답}
    F -->|성공| G["✅ 배정 완료!" 토스트]
    F -->|409 충돌| H["⚠️ 다른 사용자가 수정함" 알림]
    F -->|기타 오류| I["❌ 오류 발생" 토스트]
    
    G --> J[그리드 업데이트]
    H --> K[자동 새로고침]
    I --> A
    
    J --> A
    K --> A

    style G fill:#4CAF50,color:#fff
    style H fill:#FF9800,color:#fff
    style I fill:#F44336,color:#fff
```

### 2.2 사용 중 케이지 → 해제

```mermaid
graph TD
    A[케이지 그리드 화면] --> B[사용 중 케이지 더블클릭/터치]
    B --> C["사용을 종료하시겠어요?" 팝업]
    C --> D{사용자 선택}
    D -->|확인| E[서버에 해제 요청]
    D -->|취소| A
    
    E --> F{서버 응답}
    F -->|성공| G["✅ 해제 완료!" 토스트]
    F -->|409 충돌| H["⚠️ 다른 사용자가 수정함" 알림]
    F -->|기타 오류| I["❌ 오류 발생" 토스트]
    
    G --> J[그리드 업데이트 - 빈 케이지로]
    H --> K[자동 새로고침]
    I --> A
    
    J --> A
    K --> A

    style G fill:#4CAF50,color:#fff
    style H fill:#FF9800,color:#fff
    style I fill:#F44336,color:#fff
```

---

## 3. FEAT-2: 대시보드 조회 흐름

```mermaid
graph TD
    A[대시보드 접속] --> B[현황 데이터 로딩]
    B --> C[랙별 사용/미사용 카드 표시]
    C --> D[교수별 사용 현황 표시]
    D --> E[일/주/월 비용 차트 표시]
    
    E --> F{기간 변경?}
    F -->|일/주/월 선택| G[차트 데이터 재요청]
    G --> E
    
    F -->|No| H{케이지 관리로 이동?}
    H -->|Yes| I[케이지 관리 화면]
    H -->|No| J{리포트 다운로드?}
    J -->|Yes| K[리포트 화면으로]
    J -->|No| E
    
    style C fill:#E3F2FD
    style D fill:#E3F2FD
    style E fill:#E3F2FD
```

---

## 4. FEAT-3: 리포트 다운로드 흐름

```mermaid
graph TD
    A[리포트 화면] --> B[기간 선택]
    B --> C[날짜 범위 지정]
    C --> D{다운로드 버튼 클릭}
    
    D --> E[서버에 xlsx 생성 요청]
    E --> F{생성 완료?}
    F -->|Yes| G[xlsx 파일 다운로드 시작]
    F -->|No| H["❌ 생성 실패" 메시지]
    
    G --> I["✅ 다운로드 완료!" 토스트]
    H --> A
    I --> A

    style G fill:#4CAF50,color:#fff
    style I fill:#4CAF50,color:#fff
    style H fill:#F44336,color:#fff
```

---

## 5. 설정: 랙 관리 흐름

```mermaid
graph TD
    A[설정 > 랙 관리] --> B[기존 랙 목록 표시]
    B --> C{작업 선택}
    
    C -->|추가| D[새 랙 폼]
    D --> E[이름, 행, 열 입력]
    E --> F[저장]
    F --> G{성공?}
    G -->|Yes| H["✅ 랙이 추가되었어요!"]
    G -->|No| I["❌ 오류" 메시지]
    H --> B
    I --> D
    
    C -->|수정| J[랙 선택]
    J --> K[수정 폼]
    K --> F
    
    C -->|삭제| L[랙 선택]
    L --> M["정말 삭제하시겠어요?" 확인]
    M -->|Yes| N[삭제 요청]
    M -->|No| B
    N --> O{성공?}
    O -->|Yes| P["✅ 삭제 완료!"]
    O -->|No| Q["❌ 삭제 실패"]
    P --> B
    Q --> B

    style H fill:#4CAF50,color:#fff
    style P fill:#4CAF50,color:#fff
```

---

## 6. 설정: 교수 관리 흐름

```mermaid
graph TD
    A[설정 > 교수 관리] --> B[기존 교수 목록 표시]
    B --> C{작업 선택}
    
    C -->|추가| D[새 교수 폼]
    D --> E[이름, 담당학생, 연락처 입력]
    E --> F[저장]
    F --> G{성공?}
    G -->|Yes| H["✅ 교수가 등록되었어요!"]
    G -->|No| I["❌ 오류" 메시지]
    H --> B
    I --> D
    
    C -->|수정| J[교수 선택]
    J --> K[수정 폼]
    K --> F
    
    C -->|삭제| L[교수 선택]
    L --> M{배정된 케이지 있음?}
    M -->|Yes| N["⚠️ 배정 케이지 먼저 해제 필요"]
    M -->|No| O["정말 삭제하시겠어요?" 확인]
    N --> B
    O -->|Yes| P[삭제 요청]
    O -->|No| B
    P --> Q{성공?}
    Q -->|Yes| R["✅ 삭제 완료!"]
    Q -->|No| S["❌ 삭제 실패"]
    R --> B
    S --> B

    style H fill:#4CAF50,color:#fff
    style R fill:#4CAF50,color:#fff
    style N fill:#FF9800,color:#fff
```

---

## 7. 충돌 감지 및 자동 폴링

```mermaid
graph TD
    A[케이지 그리드 화면] --> B[3~5초마다 자동 폴링]
    B --> C{서버 데이터 변경됨?}
    C -->|Yes| D[그리드 업데이트]
    C -->|No| B
    D --> B
    
    E[사용자 수정 시도] --> F[서버에 저장 요청]
    F --> G{버전 충돌?}
    G -->|No| H[저장 성공]
    G -->|Yes| I["⚠️ 다른 사용자가 수정했어요"]
    I --> J[최신 데이터 자동 로드]
    J --> A
    H --> A

    style I fill:#FF9800,color:#fff
    style H fill:#4CAF50,color:#fff
```

---

## 8. 에러 처리 흐름

```mermaid
graph TD
    A[API 요청] --> B{응답 상태}
    
    B -->|200| C[정상 처리]
    B -->|400| D["잘못된 요청" 토스트]
    B -->|401| E[로그인 페이지로 리다이렉트]
    B -->|403| F["권한 없음" 토스트]
    B -->|404| G["찾을 수 없음" 토스트]
    B -->|409| H["충돌 발생" 알림 + 새로고침]
    B -->|500| I["서버 오류" 토스트 + 재시도 버튼]
    B -->|네트워크 오류| J["연결 실패" 토스트 + 재시도]
    
    C --> K[UI 업데이트]
    D --> L[사용자 재입력 유도]
    H --> M[자동 데이터 갱신]

    style C fill:#4CAF50,color:#fff
    style D fill:#FF9800,color:#fff
    style E fill:#F44336,color:#fff
    style F fill:#F44336,color:#fff
    style H fill:#FF9800,color:#fff
    style I fill:#F44336,color:#fff
    style J fill:#F44336,color:#fff
```
