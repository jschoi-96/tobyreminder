# TobyReminder Tasks

> plan.md 기반 세부 작업 목록. 각 항목은 완료 시 체크한다.

---

## Phase 1 — 기반 구축

### [BE] 엔티티 보강

- [x] `Priority` Enum 생성 (`NONE`, `LOW`, `MEDIUM`, `HIGH`)
- [x] `Reminder` 엔티티 필드 추가
  - [x] `notes` (String)
  - [x] `dueDate` (LocalDateTime)
  - [x] `priority` (Priority, default: NONE)
  - [x] `completedAt` (LocalDateTime)
  - [x] `createdAt` (LocalDateTime, 생성자에서 직접 설정)
  - [x] `updatedAt` (LocalDateTime, 도메인 메서드에서 직접 설정)
- [x] `@EnableJpaAuditing` 활성화 → 생성자 기반 날짜 설정으로 대체
- [x] `ReminderList` 엔티티 생성
  - [x] `id` (Long, PK)
  - [x] `name` (String, not null)
  - [x] `color` (String, hex)
  - [x] `icon` (String, 이모지)
  - [x] `createdAt` (LocalDateTime, 생성자에서 직접 설정)
- [x] `Reminder` ↔ `ReminderList` 연관관계 설정 (`@ManyToOne`)

### [BE] Repository / Service / Controller

- [x] `ReminderListRepository` 생성
- [x] `ReminderListService` 생성 (CRUD)
- [x] `ReminderListController` 생성
  - [x] `GET /api/lists`
  - [x] `POST /api/lists`
  - [x] `PUT /api/lists/{id}`
  - [x] `DELETE /api/lists/{id}`
- [x] `ReminderController` 업데이트
  - [x] `PUT /api/reminders/{id}` 추가 (전체 수정)
  - [x] `GET /api/reminders` 쿼리 파라미터 지원
    - [x] `listId` 필터
    - [x] `filter=today` (오늘 dueDate)
    - [x] `filter=scheduled` (미래 dueDate, 미완료)
    - [x] `filter=completed` (completed=true)

### [BE] CORS 설정

- [x] `config/WebConfig.java` 생성
- [x] `localhost:3000` 허용 (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`)

### [FE] 프로젝트 초기화

- [x] Next.js 15 프로젝트 생성 (`tobyreminder-web/`, TypeScript + Tailwind + App Router)
- [x] shadcn/ui 초기화 (`npx shadcn@latest init`)
- [x] TanStack Query v5 설치 및 `QueryClientProvider` 설정
- [x] Zustand v5 설치
- [x] `src/types/index.ts` 생성 (Reminder, ReminderList 타입 정의)
- [x] `src/lib/api.ts` 생성 (Spring Boot API 클라이언트 함수)
  - [x] `getReminders(params)` 함수
  - [x] `createReminder(data)` 함수
  - [x] `updateReminder(id, data)` 함수
  - [x] `toggleComplete(id)` 함수
  - [x] `deleteReminder(id)` 함수
  - [x] `getLists()` 함수
  - [x] `createList(data)` 함수
  - [x] `updateList(id, data)` 함수
  - [x] `deleteList(id)` 함수
- [x] `src/store/useAppStore.ts` 뼈대 생성 (선택된 목록 상태)

**완료 기준:** `./gradlew bootRun` + `npm run dev` 모두 오류 없이 실행

---

## Phase 2 — 레이아웃 + 스마트 목록

### [FE] 전체 레이아웃

- [ ] `globals.css` — `-apple-system` 폰트 전역 설정
- [ ] `app/layout.tsx` — 2-패널 레이아웃 (사이드바 240px + 메인)
- [ ] `components/layout/Sidebar.tsx` 컴포넌트 생성
- [ ] `components/layout/MainPanel.tsx` 컴포넌트 생성
- [ ] 사이드바 배경 `#F2F2F7` / 메인 배경 `#FFFFFF` 적용

### [FE] 스마트 목록 카드

- [ ] `components/sidebar/SmartListCard.tsx` 컴포넌트 생성
- [ ] 2열 그리드 카드 레이아웃
- [ ] 오늘 (📅 Red) / 예정 (📋 Red) / 전체 (📌 Black) / 완료됨 (✅ Gray) 카드 렌더링
- [ ] 각 카드 카운트 배지 API 연동
- [ ] 카드 클릭 시 `useAppStore` 선택 상태 업데이트

### [FE] 사이드바 나의 목록

- [ ] `components/sidebar/ListItem.tsx` 컴포넌트 생성
- [ ] `GET /api/lists` 연동 (TanStack Query)
- [ ] 색상 원 + 이름 + 미완료 카운트 렌더링
- [ ] 목록 클릭 시 메인 영역 제목 변경

**완료 기준:** 사이드바에서 목록 클릭 시 메인 영역 제목이 바뀐다

---

## Phase 3 — 리마인더 목록 + 완료 토글

### [FE] 리마인더 목록

- [ ] `components/reminder/ReminderList.tsx` 생성
- [ ] `GET /api/reminders?listId=` 연동 (TanStack Query)
- [ ] `components/reminder/ReminderItem.tsx` 생성
  - [ ] 원형 체크박스 (목록 색상 적용)
  - [ ] 제목 텍스트
  - [ ] 메모 (보조 텍스트, 13px gray)
  - [ ] 날짜/시간 표시 (기한 초과 시 red)
  - [ ] 우선순위 아이콘 (`!` / `!!` / `!!!`)
  - [ ] `>` 상세 버튼
- [ ] Hover 시 행 배경 연한 회색 (`hover:bg-gray-50`)

### [FE] 완료 토글

- [ ] 원형 체크박스 클릭 → `PATCH /api/reminders/{id}/complete`
- [ ] Optimistic Update 적용 (TanStack Query `useMutation`)
- [ ] 완료 시 취소선 CSS 적용
- [ ] 완료 체크 애니메이션 (스케일 + 색상 채움, 200ms ease)
- [ ] 완료된 리마인더 목록 하단으로 분리 표시

**완료 기준:** 체크박스 클릭 즉시 UI 반영, 새로고침 후에도 상태 유지

---

## Phase 4 — 리마인더 생성

### [FE] 인라인 리마인더 추가

- [ ] `components/reminder/AddReminderInput.tsx` 생성
- [ ] 목록 하단 고정 `+ 새로운 리마인더 추가` 버튼
- [ ] 클릭 시 인라인 텍스트 입력 필드로 전환
- [ ] Enter → `POST /api/reminders` 호출
- [ ] 저장 후 다음 입력 필드 자동 포커스 (연속 입력)
- [ ] Escape → 입력 취소 및 버튼으로 복귀
- [ ] Optimistic Update 적용 (목록에 즉시 추가)
- [ ] 빈 값 Enter 시 무시

**완료 기준:** Enter 연속으로 리마인더 여러 개 빠르게 추가 가능

---

## Phase 5 — 리마인더 상세 편집 패널

### [FE] 슬라이드 패널

- [ ] `components/reminder/ReminderDetailPanel.tsx` 생성
- [ ] 우측 슬라이드인 애니메이션 (300ms ease-out)
- [ ] 패널 외부 클릭 시 닫힘
- [ ] `[완료]` 버튼으로 닫기

### [FE] 패널 내 편집 필드

- [ ] 제목 인라인 텍스트 입력
- [ ] 메모 텍스트에어리어
- [ ] 날짜 ON/OFF 토글 + 날짜 선택기
- [ ] 시간 ON/OFF 토글 + 시간 선택기
- [ ] 우선순위 세그먼트 버튼 (없음 / 낮음 / 중간 / 높음)
- [ ] 목록 선택 드롭다운 (`GET /api/lists` 연동)
- [ ] 변경 감지 → `PUT /api/reminders/{id}` 자동 저장 (debounce 500ms)
- [ ] 저장 후 목록 즉시 반영 (TanStack Query invalidate)

**완료 기준:** 패널에서 제목 수정 시 목록에 즉시 반영

---

## Phase 6 — 목록 관리

### [FE] 목록 생성

- [ ] `components/list/CreateListModal.tsx` 생성
- [ ] `+ 목록 추가` 버튼 → 모달 열기
- [ ] 이름 입력 필드
- [ ] 색상 팔레트 선택 (Apple 10색: Red / Orange / Yellow / Green / Blue / Purple / Pink / Brown / Gray / Black)
- [ ] 이모지 아이콘 입력 또는 선택
- [ ] `POST /api/lists` 연동
- [ ] 생성 후 사이드바 즉시 반영

### [FE] 목록 수정 / 삭제

- [ ] 목록 우클릭 → 컨텍스트 메뉴 표시
- [ ] 컨텍스트 메뉴: 이름 변경
- [ ] 컨텍스트 메뉴: 목록 삭제
- [ ] 삭제 확인 다이얼로그 (shadcn/ui `AlertDialog`)
- [ ] `PUT /api/lists/{id}` 연동 (이름/색상/아이콘 수정)
- [ ] `DELETE /api/lists/{id}` 연동

**완료 기준:** 새 목록 생성 후 색상 지정, 해당 목록에 리마인더 추가 가능

---

## Phase 7 — 리마인더 삭제 + 검색

### [FE] 리마인더 삭제

- [ ] 리마인더 우클릭 → 컨텍스트 메뉴
- [ ] 컨텍스트 메뉴: 삭제 항목
- [ ] `DELETE /api/reminders/{id}` 연동
- [ ] 삭제 fadeOut 애니메이션 (높이 축소, 250ms)
- [ ] Optimistic Update 적용

### [FE] 검색

- [ ] 사이드바 상단 검색 입력 필드 (`🔍`)
- [ ] 검색어 입력 시 `useAppStore` 검색 상태 업데이트
- [ ] 메인 영역에서 제목 + 메모 기준 실시간 클라이언트 필터링
- [ ] 검색 중 스마트 목록 / 일반 목록 선택 비활성화
- [ ] 검색어 지우면 이전 목록 상태로 복귀

**완료 기준:** 검색어 입력 즉시 필터링, 삭제 시 애니메이션과 함께 제거

---

## Phase 8 — 다크 모드 + 반응형

### [FE] 다크 모드

- [ ] CSS 변수 색상 토큰 정의 (라이트/다크 각각)
  - [ ] 사이드바: `#F2F2F7` / `#1C1C1E`
  - [ ] 메인 배경: `#FFFFFF` / `#000000`
  - [ ] 카드 배경: `#FFFFFF` / `#2C2C2E`
  - [ ] 기본 텍스트: `#000000` / `#FFFFFF`
  - [ ] 보조 텍스트: `#6C6C70` / `#8E8E93`
  - [ ] 구분선: `#C6C6C8` / `#38383A`
- [ ] `prefers-color-scheme: dark` 미디어 쿼리 적용
- [ ] Tailwind `dark:` 클래스 전체 점검

### [FE] 반응형

- [ ] 모바일 (`< 768px`): 사이드바 숨김
- [ ] 모바일: 햄버거 버튼 → 사이드바 오버레이 토글
- [ ] 태블릿 (`768px ~ 1024px`): 사이드바 아이콘만 표시 (축소 모드)
- [ ] 메인 영역 패딩/폰트 모바일 최적화

**완료 기준:** 시스템 다크 모드 전환 시 자동 반영, 모바일에서 사이드바 토글 동작

---

## 진행 현황

| Phase | 내용 | BE | FE |
|-------|------|----|----|
| Phase 1 | 기반 구축 | ✅ | ✅ |
| Phase 2 | 레이아웃 + 스마트 목록 | — | ⬜ |
| Phase 3 | 리마인더 목록 + 완료 토글 | — | ⬜ |
| Phase 4 | 리마인더 생성 | — | ⬜ |
| Phase 5 | 리마인더 상세 편집 패널 | — | ⬜ |
| Phase 6 | 목록 관리 | — | ⬜ |
| Phase 7 | 리마인더 삭제 + 검색 | — | ⬜ |
| Phase 8 | 다크 모드 + 반응형 | — | ⬜ |
