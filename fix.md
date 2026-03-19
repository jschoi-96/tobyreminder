# fix.md — 코드 리뷰 수정 작업 목록

> 코드 리뷰 결과를 우선순위별로 정리한 체크리스트.
> 완료 시 해당 항목에 체크한다.

---

## Critical

- [x] **[FE] `ReminderDetailPanel` 자동저장 Race Condition 해결**
  - `buildDueDate()`를 `useCallback` 내부로 이동
  - `eslint-disable-next-line react-hooks/exhaustive-deps` 우회 제거
  - 상태 변경마다 불필요한 API 호출 방지 (변경이 실제로 있을 때만 저장)
  - `timeEnabled=true`이지만 `timeValue`가 비어있는 경우 방어 처리

- [x] **[FE] `isToday()` 날짜 로직 중앙화**
  - `Sidebar.tsx`, `ReminderList.tsx`, `ReminderItem.tsx`에 중복된 3개 구현 제거
  - `src/lib/dateUtils.ts`에 `isToday()`, `isOverdue()`, `formatDueDate()` 통합
  - 각 컴포넌트에서 유틸 함수 import로 교체

- [x] **[FE] `ReminderDetailPanel` 저장 실패 시 에러 핸들링 추가**
  - `save` mutation에 `onError` 핸들러 구현
  - 저장 실패 시 사용자에게 토스트/에러 메시지 표시
  - 이전 상태로 롤백 처리

---

## Major

- [x] **[FE] 사이드바 `incompleteByList()` 성능 개선**
  - `incompleteByList(list.id)` 가 리스트마다 전체 리마인더를 선형 탐색하는 O(lists × reminders) 문제 해결
  - `useMemo`로 `{ [listId]: count }` 맵 사전 계산

- [x] **[FE] 완료 토글 rollback 타입 안전성 강화**
  - `ReminderItem.tsx` `onError`에서 `ctx?.prev`가 undefined일 때 refetch fallback 추가
  - context 타입 명시

- [x] **[FE] API 에러 클래스 도입**
  - `src/lib/api.ts`의 `request()` 함수에서 HTTP 상태 코드를 포함한 커스텀 `ApiError` 클래스 생성
  - 컴포넌트에서 상태 코드 기반 분기 처리 가능하도록

- [x] **[BE] `GlobalExceptionHandler` 핸들러 보완**
  - `MethodArgumentNotValidException` (400 유효성 검사 실패) 핸들러 추가
  - 예상치 못한 예외를 위한 catch-all `Exception` 핸들러 추가
  - 에러 응답 포맷 일관성 유지

- [x] **[BE] 전용 예외 타입 도입**
  - `IllegalArgumentException` 단일 타입으로 리소스 미존재와 도메인 규칙 위반을 모두 처리하는 문제 개선
  - `ResourceNotFoundException` (→ 404), `DomainException` (→ 400) 분리
  - `GlobalExceptionHandler`에서 각각 처리

- [ ] **[BE] `LocalDateTime` → `OffsetDateTime` 전환 검토**
  - 타임존 정보 손실 문제 해결
  - 클라이언트와 서버 간 날짜 불일치 방지
  - `ReminderRequest`, `ReminderResponse`, 도메인 엔티티 일관 변경

---

## Minor

- [ ] **[BE] `ReminderRequest` 유효성 검사 강화**
  - `notes` 필드에 `@Size(max = 1000)` 추가
  - `dueDate` 에 `@FutureOrPresent` 검토 (과거 날짜 등록 허용 여부 정책 결정)

- [ ] **[FE] `debouncedTitle` 빈 문자열 처리 수정**
  - `ReminderDetailPanel.tsx:100` `debouncedTitle || reminder.title` 패턴 수정
  - 빈 문자열 입력 시 원래 제목으로 복원되는 의도치 않은 동작 제거
  - `debouncedTitle !== undefined ? debouncedTitle : reminder.title` 로 변경

- [ ] **[FE] 색상 상수 중앙화**
  - `#FFD1D1`, `#E5E5EA`, `#FF3B30` 등 매직 스트링이 여러 파일에 분산
  - `src/lib/colors.ts` 또는 Tailwind config로 통합

- [ ] **[FE] `staleTime` 조정**
  - `providers.tsx`의 `staleTime: 1000 * 60` (60초) → mutation 후 즉시 반영되도록 단축 또는 `gcTime`과 분리

- [ ] **[FE] Detail Panel 로딩/에러 상태 추가**
  - 목록 조회 실패 시 드롭다운이 빈 채로 표시되는 문제
  - `isLoading`, `isError` 상태에 따른 UI 처리 추가

---

## Suggestions

- [ ] **[FE] `ListSelect` 컴포넌트 추출**
  - `ReminderDetailPanel` 내 목록 선택 드롭다운을 별도 컴포넌트로 분리
  - 추후 리마인더 생성 시 재사용 가능

- [ ] **[BE] `DefaultReminderService.findAll()` 필터 로직 JavaDoc 추가**
  - null/빈 필터에 대한 동작 설명
  - 프론트 연동 시 명세 기준 명확화

- [ ] **[FE] 비어있는 체크 패턴 통일**
  - `filtered.length === 0`, `lists.length > 0` 등 혼재
  - 코드베이스 전체에서 일관된 패턴 사용

---

## 진행 현황

| 구분 | 전체 | 완료 | 진행률 |
|------|------|------|--------|
| Critical | 3 | 3 | 100% |
| Major | 6 | 5 | 83% |
| Minor | 5 | 0 | 0% |
| Suggestions | 3 | 0 | 0% |
| **합계** | **17** | **8** | **47%** |
