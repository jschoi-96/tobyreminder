# PRD: TobyReminder — Apple Reminder Web 버전

## 1. 개요

Apple Reminder App의 핵심 기능을 웹에서 사용할 수 있도록 구현하는 풀스택 웹 애플리케이션.

- **Backend:** Spring Boot 4 + JPA/H2 (REST API)
- **Frontend:** Next.js 15 (App Router)

---

## 2. 목표

- Apple Reminder macOS/iOS의 UI/UX를 웹에서 최대한 충실히 재현
- 리마인더 CRUD 및 목록 관리 기능 제공
- Apple Human Interface Guidelines 기반 디자인 적용

---

## 3. UI/UX 상세 명세 (Apple Reminder 기준)

### 3.1 전체 레이아웃
```
┌──────────────────────────────────────────────────────────────────┐
│  사이드바 (240px)              │  메인 컨텐츠 영역                 │
│  배경: #F2F2F7 (연한 회색)     │  배경: #FFFFFF                   │
│                                │                                  │
│  ┌──────────────────────────┐  │  [목록 제목]          [편집] [...]│
│  │  🔍 검색                  │  │  ─────────────────────────────  │
│  └──────────────────────────┘  │                                  │
│                                │  ☐  리마인더 제목                 │
│  [스마트 목록] (2열 그리드)      │     메모 텍스트                   │
│  ┌────────┐  ┌────────┐        │     📅 오늘 오후 3:00  !          │
│  │ 📅 오늘 │  │ 📋 예정 │        │                                  │
│  │   3    │  │   12   │        │  ☐  리마인더 제목                 │
│  └────────┘  └────────┘        │                                  │
│  ┌────────┐  ┌────────┐        │  ─────────────────────────────  │
│  │ 📌 전체 │  │ ✅ 완료 │        │  + 새로운 리마인더 추가            │
│  │   45   │  │   8    │        │                                  │
│  └────────┘  └────────┘        │                                  │
│                                │                                  │
│  나의 목록                      │                                  │
│  ● 업무             12 >        │                                  │
│  ● 개인              5 >        │                                  │
│  ● 쇼핑              3 >        │                                  │
│                                │                                  │
│  [+ 목록 추가]                  │                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 색상 시스템 (Apple System Colors)
| 용도 | 색상 | Hex |
|------|------|-----|
| 사이드바 배경 | System Gray 6 | `#F2F2F7` |
| 메인 배경 | White | `#FFFFFF` |
| 기본 텍스트 | Label | `#000000` |
| 보조 텍스트 | Secondary Label | `#3C3C43` (60%) |
| 구분선 | Separator | `#C6C6C8` |
| 강조색 (기본) | System Blue | `#007AFF` |
| 완료 체크 | 목록 색상 따라감 | - |
| 기한 초과 | System Red | `#FF3B30` |
| 우선순위 높음 | System Red | `#FF3B30` |
| 우선순위 중간 | System Orange | `#FF9500` |
| 우선순위 낮음 | System Blue | `#007AFF` |

### 3.3 스마트 목록 카드 (2열 그리드)
- 카드 배경: 각 목록 고유 색상 (연한 버전)
- 아이콘: 흰 원형 배경 위에 SF Symbol 스타일 이모지
- 카운트 배지: 우측 하단, 굵은 숫자
- Apple 기본 스마트 목록 색상:
  - 오늘: `#FF3B30` (Red)
  - 예정: `#FF3B30` (Red)
  - 전체: `#000000` (Black)
  - 완료됨: `#8E8E93` (Gray)

### 3.4 리마인더 아이템 상세
```
┌────────────────────────────────────────────────────┐
│  ○  제목 텍스트                              !  >   │
│     메모 텍스트 (gray, 작은 폰트)                    │
│     📅 오늘 오후 3:00                               │
└────────────────────────────────────────────────────┘
```
- 체크박스: 원형, 미완료=테두리만, 완료=목록색 채움 + 체크
- 완료 시: 제목에 취소선, 텍스트 흐림 처리
- `>` 버튼: 클릭 시 상세 편집 패널 슬라이드인 (오른쪽에서)
- `!` 아이콘: 우선순위 표시 (없음/!, !!, !!!)
- Hover 시: 행 배경 연한 회색

### 3.5 리마인더 상세 편집 패널 (우측 슬라이드)
```
┌──────────────────────────────┐
│  세부사항              [완료]  │
│  ─────────────────────────   │
│  제목                         │
│  [___________________]        │
│                               │
│  메모                         │
│  [___________________]        │
│  [___________________]        │
│                               │
│  날짜    [ON/OFF 토글]         │
│  📅 2026년 3월 16일            │
│                               │
│  시간    [ON/OFF 토글]         │
│  ⏰ 오전 9:00                  │
│                               │
│  우선순위                      │
│  [없음] [낮음] [중간] [높음]   │
│                               │
│  목록                         │
│  ● 업무            >          │
│                               │
│  메모 삭제                     │
└──────────────────────────────┘
```

### 3.6 새 리마인더 추가
- 목록 하단 고정: `+ 새로운 리마인더 추가` 텍스트
- 클릭 시 해당 위치에서 인라인 입력 필드로 전환
- Enter: 저장 후 다음 입력 필드 생성
- Escape: 취소

### 3.7 목록 사이드바 아이템
```
  ●  업무                    12 >
  ↑  ↑                       ↑  ↑
색원 이름              카운트 배지 화살표
```
- 색상 원: 12px, 목록 지정 색상
- 카운트: 미완료 리마인더 수, gray 텍스트
- 선택 시: 행 배경 흰색 + 둥근 모서리 카드

### 3.8 타이포그래피
| 요소 | 폰트 | 크기 | 굵기 |
|------|------|------|------|
| 목록 제목 (메인) | SF Pro / -apple-system | 28px | 700 |
| 섹션 헤더 | SF Pro / -apple-system | 13px | 600 |
| 리마인더 제목 | SF Pro / -apple-system | 15px | 400 |
| 메모 | SF Pro / -apple-system | 13px | 400 |
| 날짜/시간 | SF Pro / -apple-system | 12px | 400 |
| 스마트 목록 카운트 | SF Pro / -apple-system | 28px | 700 |

### 3.9 다크 모드
- `prefers-color-scheme: dark` 자동 대응
- 사이드바: `#1C1C1E`, 메인: `#000000`
- 카드: `#2C2C2E`

### 3.10 애니메이션
| 인터랙션 | 애니메이션 |
|----------|-----------|
| 완료 체크 | 체크박스 스케일 + 색상 채움 (200ms ease) |
| 아이템 삭제 | 높이 축소 후 fadeOut (250ms) |
| 상세 패널 오픈 | 오른쪽에서 슬라이드인 (300ms ease-out) |
| 목록 선택 | 배경색 전환 (150ms) |
| 스마트 카드 hover | 살짝 어두워짐 (100ms) |

---

## 4. 핵심 기능 (MVP)

### 4.1 리마인더 관리
| 기능 | 설명 |
|------|------|
| 리마인더 생성 | 제목, 메모, 날짜/시간, 우선순위 설정 |
| 리마인더 조회 | 전체 목록 / 목록별 필터링 |
| 리마인더 수정 | 인라인 편집 + 상세 패널 편집 |
| 리마인더 삭제 | 스와이프 또는 우클릭 컨텍스트 메뉴 |
| 완료 처리 | 원형 체크박스 클릭으로 완료 토글 |

### 4.2 목록(List) 관리
| 기능 | 설명 |
|------|------|
| 목록 생성 | 이름, 이모지 아이콘, 색상 지정 |
| 목록 조회 | 사이드바 하단에 목록 표시 |
| 목록 삭제 | 목록 및 소속 리마인더 함께 삭제 |

### 4.3 스마트 목록 (필터)
| 스마트 목록 | 아이콘 | 색상 | 조건 |
|------------|--------|------|------|
| 오늘 | 📅 | Red | 오늘 날짜의 리마인더 |
| 예정 | 📋 | Red | 미래 날짜의 미완료 리마인더 |
| 전체 | 📌 | Black | 모든 미완료 리마인더 |
| 완료됨 | ✅ | Gray | completed = true |

---

## 5. 데이터 모델

### Reminder
```
id            Long         PK
title         String       필수
notes         String       선택
dueDate       LocalDateTime 선택
priority      Enum(NONE/LOW/MEDIUM/HIGH)
completed     Boolean      default: false
completedAt   LocalDateTime 선택
listId        Long         FK → ReminderList
createdAt     LocalDateTime
updatedAt     LocalDateTime
```

### ReminderList
```
id        Long    PK
name      String  필수
color     String  hex 색상 (예: #FF3B30)
icon      String  SF Symbol 이름 또는 이모지
createdAt LocalDateTime
```

---

## 6. API 설계

### Reminder
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/reminders` | 전체 조회 (쿼리: listId, completed, due) |
| GET | `/api/reminders/{id}` | 단건 조회 |
| POST | `/api/reminders` | 생성 |
| PUT | `/api/reminders/{id}` | 수정 |
| PATCH | `/api/reminders/{id}/complete` | 완료 토글 |
| DELETE | `/api/reminders/{id}` | 삭제 |

### ReminderList
| Method | URL | 설명 |
|--------|-----|------|
| GET | `/api/lists` | 전체 조회 |
| POST | `/api/lists` | 생성 |
| PUT | `/api/lists/{id}` | 수정 |
| DELETE | `/api/lists/{id}` | 삭제 (리마인더 포함) |

---

## 7. 기술 스택

### Backend
- Spring Boot 4.0.3
- Spring Data JPA + H2 (인메모리)
- Java 21
- Gradle Kotlin DSL

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (컴포넌트)
- TanStack Query (서버 상태 관리)
- Zustand (클라이언트 상태 관리)

---

## 8. 프로젝트 구조

```
tobyreminder/                  ← 현재 Spring Boot 프로젝트
tobyreminder-web/              ← Next.js 프로젝트 (신규)
  ├── app/
  │   ├── layout.tsx
  │   ├── page.tsx
  │   └── api/                 ← Next.js API Routes (프록시용, 필요시)
  ├── components/
  │   ├── Sidebar.tsx
  │   ├── ReminderList.tsx
  │   ├── ReminderItem.tsx
  │   └── AddReminderInput.tsx
  ├── lib/
  │   └── api.ts               ← Spring Boot API 클라이언트
  └── store/
      └── useReminderStore.ts
```

---

## 9. 비기능 요구사항

- **반응형:** 데스크탑 우선, 모바일 대응 (사이드바 햄버거 메뉴로 전환)
- **폰트:** `-apple-system, BlinkMacSystemFont, "SF Pro Text"` 우선 사용
- **UX:** 리마인더 추가/완료 시 페이지 리로드 없이 즉시 반영 (Optimistic Update)
- **CORS:** Spring Boot에서 `localhost:3000` 허용
- **접근성:** 키보드 탐색 완전 지원 (Tab, Enter, Escape)

---

## 10. 개발 순서 (제안)

1. **Backend 보강**
   - `ReminderList` 엔티티 및 API 추가
   - `Reminder` 엔티티에 `notes`, `dueDate`, `priority`, `listId` 필드 추가
   - CORS 설정

2. **Frontend 구축**
   - Next.js 프로젝트 초기화
   - 레이아웃 (사이드바 + 메인)
   - API 연동 (TanStack Query)
   - 리마인더 CRUD UI

---

## 11. 범위 외 (MVP 이후)

- 사용자 인증/회원가입
- 알림/푸시 기능
- 드래그앤드롭 순서 변경
- 서브태스크
- 반복 리마인더
- DB를 H2 → PostgreSQL 전환
