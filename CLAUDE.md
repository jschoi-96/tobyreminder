# CLAUDE.md — TobyReminder 코딩 관례

## 참고 문서

| 문서 | 설명 |
|------|------|
| [`spec.md`](./spec.md) | 제품 요구사항 및 UI/UX 상세 명세 |
| [`plan.md`](./plan.md) | Phase별 개발 계획 및 기술 스택 |
| [`tasks.md`](./tasks.md) | Phase별 세부 작업 체크리스트 |

---

## 실행 환경

```bash
JAVA_HOME="/Users/junsoo/.sdkman/candidates/java/current"
PATH="$JAVA_HOME/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# 빌드
./gradlew compileJava

# 테스트
./gradlew test

# 실행
./gradlew bootRun
```

---

## 도메인 엔티티 규칙

### Setter 사용 금지
- 엔티티에 `@Setter` 또는 개별 setter 메서드를 추가하지 않는다.
- 상태 변경은 반드시 의미 있는 도메인 메서드로 표현한다.

```java
// ❌ 금지
reminder.setCompleted(true);

// ✅ 올바른 방법
reminder.complete();
```

### 생성자에서 날짜 설정
- `createdAt` / `updatedAt`은 JPA Auditing(`@CreatedDate`, `@LastModifiedDate`) 대신 생성자와 도메인 메서드에서 직접 `LocalDateTime.now()`로 설정한다.

```java
public Reminder(String title) {
    this.title = title;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
}

public void update(...) {
    // 필드 수정
    this.updatedAt = LocalDateTime.now();
}
```


### 기본 생성자
- JPA 요구사항을 위해 `@NoArgsConstructor`는 유지한다.
- 단, 기본 생성자로 생성된 객체는 `createdAt`이 null임을 허용한다 (JPA 내부 사용 전용).

---

## 테스트 규칙

### 기능 추가/수정 시 테스트를 항상 함께 작성한다.

### 도메인 Unit Test
- Spring Context, JPA 없이 순수 JUnit 5로 작성한다.
- `@SpringBootTest`, `EntityManager`, Mockito 사용 금지.

```java
class ReminderListTest {
    @Test
    void createWithAllFields() {
        ReminderList list = new ReminderList("업무", "#007AFF", "💼");
        assertThat(list.getName()).isEqualTo("업무");
    }
}
```

### Repository Test
- `@SpringBootTest` + `@Transactional` 사용.
- 테스트 후 자동 롤백.

### Service Test
- Mockito 기반 Unit Test (`@ExtendWith(MockitoExtension.class)`).
- Repository를 Mock으로 처리한다.

### 테스트 구조
- `@Nested` + `@DisplayName`으로 계층 구조를 명확히 한다.
- DisplayName은 한국어로 작성한다.

```java
@Nested
@DisplayName("complete()")
class Complete {
    @Test
    @DisplayName("완료 처리 시 completed가 true가 된다")
    void completeSetsTrueFlag() { ... }
}
```

---

## 레이어 구조

```
controller  →  service  →  repository  →  domain
```

- Controller는 요청/응답 변환만 담당한다.
- 비즈니스 로직은 Service 또는 Domain에 위치한다.
- Domain 메서드에 핵심 로직을 담는다 (Rich Domain Model).

---

## API 설계

- REST 컨벤션을 따른다.
- 기본 경로: `/api/`
- 완료 토글처럼 부분 상태 변경은 `PATCH` 사용.

```
GET    /api/reminders
POST   /api/reminders
PUT    /api/reminders/{id}
PATCH  /api/reminders/{id}/complete
DELETE /api/reminders/{id}
```

---

## 기타

- Lombok: `@Getter`, `@NoArgsConstructor`, `@RequiredArgsConstructor`만 허용. `@Setter`, `@Data` 사용 금지.
- 예외 처리: `IllegalArgumentException`으로 도메인 규칙 위반을 표현한다.
- H2 콘솔: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:tobyreminder`)
