# TobyReminder 개발 계획

> spec.md 기반 단계적 개발 계획. 단순한 것부터 기능을 점진적으로 추가한다.

---

## 기술 스택 요약

### Backend
| 항목 | 기술 |
|------|------|
| Framework | Spring Boot 4.0.3 |
| ORM | Spring Data JPA (Hibernate 7) |
| Database | H2 (인메모리, 개발용) |
| Language | Java 21 |
| Build | Gradle 8.14 + Kotlin DSL |
| API | REST (JSON) |

### Frontend
| 항목 | 기술 |
|------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| 폰트 | `-apple-system, BlinkMacSystemFont` (SF Pro 계열) |

### 개발 환경
| 항목 | 내용 |
|------|------|
| Backend 포트 | `localhost:8080` |
| Frontend 포트 | `localhost:3000` |
| CORS | Spring Boot → `localhost:3000` 허용 |
| API 통신 | Frontend → `http://localhost:8080/api` 직접 호출 |

---

## Phase 1 — 기반 구축 (Backend 기초 + Frontend 뼈대)

> 목표: 앱이 뜨고, 하드코딩 없이 데이터가 오가는 것을 확인한다.

### 1-1. Backend 보강

**현재 상태:** `Reminder` 엔티티에 `title`, `description`, `reminderAt`, `completed` 필드만 존재.

**할 일:**

- [ ] `Reminder` 엔티티 필드 추가
  - `notes` (String)
  - `dueDate` (LocalDateTime)
  - `priority` (Enum: NONE / LOW / MEDIUM / HIGH)
  - `completedAt` (LocalDateTime)
  - `createdAt` / `updatedAt` (자동 관리 `@CreatedDate`, `@LastModifiedDate`)
- [ ] `ReminderList` 엔티티 신규 생성
  - `id`, `name`, `color` (hex), `icon` (이모지), `createdAt`
- [ ] `Reminder` ↔ `ReminderList` 연관관계 설정 (`@ManyToOne`)
- [ ] `ReminderListRepository` / `ReminderListService` / `ReminderListController` 생성
- [ ] `ReminderController` PUT 엔드포인트 추가 (전체 수정)
- [ ] CORS 설정 (`WebMvcConfigurer`)
- [ ] 스마트 목록 쿼리 추가
  - 오늘: `dueDate between 오늘 00:00 ~ 23:59`
  - 예정: `dueDate > 오늘, completed = false`
  - 완료됨: `completed = true`

**API 목표:**
```
GET    /api/lists
POST   /api/lists
PUT    /api/lists/{id}
DELETE /api/lists/{id}

GET    /api/reminders?listId=&filter=today|scheduled|all|completed
POST   /api/reminders
PUT    /api/reminders/{id}
PATCH  /api/reminders/{id}/complete
DELETE /api/reminders/{id}
```

---

### 1-2. Frontend 초기화

- [ ] Next.js 15 프로젝트 생성 (`tobyreminder-web/`)
  ```bash
  npx create-next-app@latest tobyreminder-web \
    --typescript --tailwind --app --src-dir
  ```
- [ ] shadcn/ui 초기화
- [ ] TanStack Query Provider 설정
- [ ] Zustand store 뼈대 생성
- [ ] `lib/api.ts` — Spring Boot API 클라이언트 함수 작성

**완료 기준:** `npm run dev` 실행 시 빈 화면이라도 오류 없이 뜬다.

---

## Phase 2 — 레이아웃 + 스마트 목록

> 목표: Apple Reminder의 사이드바 + 메인 레이아웃을 구현한다. 데이터는 실제 API에서 가져온다.

### 할 일

**레이아웃**
- [ ] 2-패널 레이아웃 구현 (사이드바 240px + 메인 영역)
- [ ] 사이드바 배경 `#F2F2F7`, 메인 배경 `#FFFFFF`
- [ ] `-apple-system` 폰트 전역 적용

**사이드바 — 스마트 목록 (2열 그리드 카드)**
- [ ] 오늘 / 예정 / 전체 / 완료됨 카드 렌더링
- [ ] 각 카드에 미완료 카운트 배지 표시 (API 연동)
- [ ] 카드 클릭 시 메인 영역 필터링

**사이드바 — 나의 목록**
- [ ] `GET /api/lists` 연동, 목록 리스트 렌더링
- [ ] 색상 원 + 이름 + 카운트 배지
- [ ] 목록 클릭 시 해당 목록 리마인더 표시

**완료 기준:** 사이드바에서 목록을 클릭하면 메인 영역 제목이 바뀐다.

---

## Phase 3 — 리마인더 목록 + 완료 토글

> 목표: 리마인더를 화면에 보여주고, 체크박스로 완료 처리할 수 있다.

### 할 일

**리마인더 목록**
- [ ] `GET /api/reminders?listId=` 연동
- [ ] 리마인더 아이템 컴포넌트 구현
  - 원형 체크박스 (목록 색상 적용)
  - 제목 텍스트
  - 메모 (보조 텍스트, 작은 폰트)
  - 날짜/시간 표시
  - 우선순위 `!` / `!!` / `!!!` 아이콘
  - `>` 버튼 (상세 패널 진입)
- [ ] Hover 시 행 배경 연한 회색

**완료 토글**
- [ ] 원형 체크박스 클릭 → `PATCH /api/reminders/{id}/complete`
- [ ] Optimistic Update 적용 (클릭 즉시 UI 반영)
- [ ] 완료 시 취소선 + 텍스트 흐림 애니메이션 (200ms)

**완료 기준:** 체크박스 클릭 시 즉시 완료 처리되고, 새로고침해도 상태 유지.

---

## Phase 4 — 리마인더 생성

> 목표: `+ 새로운 리마인더 추가`로 인라인 입력해서 저장한다.

### 할 일

- [ ] 목록 하단 고정 `+ 새로운 리마인더 추가` 버튼
- [ ] 클릭 시 인라인 입력 필드로 전환
- [ ] Enter → `POST /api/reminders` → 목록에 즉시 추가
- [ ] Enter 후 다음 입력 필드 자동 생성 (연속 입력)
- [ ] Escape → 취소
- [ ] Optimistic Update 적용

**완료 기준:** Enter를 연속으로 눌러 리마인더를 여러 개 빠르게 추가할 수 있다.

---

## Phase 5 — 리마인더 상세 편집 패널

> 목표: `>` 버튼 클릭 시 우측에서 슬라이드인되는 편집 패널을 구현한다.

### 할 일

- [ ] 우측 슬라이드 패널 컴포넌트 (300ms ease-out 애니메이션)
- [ ] 패널 내 편집 필드
  - 제목 (텍스트 입력)
  - 메모 (텍스트에어리어)
  - 날짜 ON/OFF 토글 + 날짜 선택기
  - 시간 ON/OFF 토글 + 시간 선택기
  - 우선순위 세그먼트 버튼 (없음 / 낮음 / 중간 / 높음)
  - 목록 선택 (드롭다운)
- [ ] 변경 시 `PUT /api/reminders/{id}` 자동 저장 (debounce 500ms)
- [ ] `[완료]` 버튼으로 패널 닫기

**완료 기준:** 패널에서 제목을 수정하면 목록에 즉시 반영된다.

---

## Phase 6 — 목록 관리

> 목표: 새 목록을 만들고, 색상/아이콘을 지정할 수 있다.

### 할 일

- [ ] `+ 목록 추가` 버튼 → 목록 생성 모달
  - 이름 입력
  - 색상 팔레트 선택 (Apple 기본 10가지 색상)
  - 이모지 아이콘 선택
- [ ] `POST /api/lists` 연동
- [ ] 목록 우클릭 컨텍스트 메뉴
  - 이름 변경
  - 목록 삭제 (확인 다이얼로그)
- [ ] `PUT /api/lists/{id}`, `DELETE /api/lists/{id}` 연동

**완료 기준:** 새 목록을 만들고 색상을 지정한 뒤, 해당 목록에 리마인더를 추가할 수 있다.

---

## Phase 7 — 리마인더 삭제 + 검색

> 목표: 리마인더를 삭제하고, 검색으로 빠르게 찾을 수 있다.

### 할 일

**삭제**
- [ ] 리마인더 우클릭 컨텍스트 메뉴 → 삭제
- [ ] 삭제 시 높이 축소 fadeOut 애니메이션 (250ms)
- [ ] `DELETE /api/reminders/{id}` 연동

**검색**
- [ ] 사이드바 상단 검색 입력 필드
- [ ] 타이핑 시 실시간 필터링 (제목 + 메모 대상)
- [ ] 검색 결과를 메인 영역에 표시

**완료 기준:** 리마인더를 삭제하면 애니메이션과 함께 사라진다. 검색어 입력 시 즉시 필터링된다.

---

## Phase 8 — 다크 모드 + 반응형

> 목표: 다크 모드와 모바일 화면을 지원한다.

### 할 일

**다크 모드**
- [ ] `prefers-color-scheme: dark` 자동 감지
- [ ] CSS 변수 기반 색상 토큰 적용
  - 사이드바: `#1C1C1E`
  - 메인: `#000000`
  - 카드: `#2C2C2E`
  - 텍스트: `#FFFFFF`

**반응형**
- [ ] 모바일 (< 768px): 사이드바 숨김, 햄버거 메뉴로 토글
- [ ] 태블릿 (768px ~ 1024px): 사이드바 아이콘만 표시

**완료 기준:** 시스템 다크 모드 전환 시 앱이 자동으로 따라간다.

---

## 파일 구조 목표

```
tobyreminder/                          ← Spring Boot
├── src/main/java/tody/ai/tobyreminder/
│   ├── config/
│   │   └── WebConfig.java             ← CORS 설정
│   ├── entity/
│   │   ├── Reminder.java
│   │   └── ReminderList.java
│   ├── repository/
│   │   ├── ReminderRepository.java
│   │   └── ReminderListRepository.java
│   ├── service/
│   │   ├── ReminderService.java
│   │   └── ReminderListService.java
│   └── controller/
│       ├── ReminderController.java
│       └── ReminderListController.java
└── src/main/resources/
    └── application.properties

tobyreminder-web/                      ← Next.js 15
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainPanel.tsx
│   │   ├── sidebar/
│   │   │   ├── SmartListCard.tsx
│   │   │   └── ListItem.tsx
│   │   ├── reminder/
│   │   │   ├── ReminderList.tsx
│   │   │   ├── ReminderItem.tsx
│   │   │   ├── ReminderDetailPanel.tsx
│   │   │   └── AddReminderInput.tsx
│   │   └── list/
│   │       └── CreateListModal.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── store/
│   │   └── useAppStore.ts
│   └── types/
│       └── index.ts
└── package.json
```

---

## 진행 현황

| Phase | 내용 | 상태 |
|-------|------|------|
| Phase 1 | 기반 구축 (Backend 보강 + Frontend 초기화) | ⬜ 대기 |
| Phase 2 | 레이아웃 + 스마트 목록 | ⬜ 대기 |
| Phase 3 | 리마인더 목록 + 완료 토글 | ⬜ 대기 |
| Phase 4 | 리마인더 생성 (인라인) | ⬜ 대기 |
| Phase 5 | 리마인더 상세 편집 패널 | ⬜ 대기 |
| Phase 6 | 목록 관리 (생성/수정/삭제) | ⬜ 대기 |
| Phase 7 | 리마인더 삭제 + 검색 | ⬜ 대기 |
| Phase 8 | 다크 모드 + 반응형 | ⬜ 대기 |
