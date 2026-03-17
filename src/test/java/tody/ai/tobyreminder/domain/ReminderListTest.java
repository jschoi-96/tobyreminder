package tody.ai.tobyreminder.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ReminderListTest {

    @Nested
    @DisplayName("생성자")
    class Constructor {

        @Test
        @DisplayName("name, color, icon으로 생성하면 필드가 올바르게 설정된다")
        void createWithAllFields() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");

            assertThat(list.getName()).isEqualTo("업무");
            assertThat(list.getColor()).isEqualTo("#007AFF");
            assertThat(list.getIcon()).isEqualTo("💼");
        }

        @Test
        @DisplayName("생성 시 createdAt이 자동으로 설정된다")
        void createdAtIsSetOnConstruct() {
            var before = java.time.LocalDateTime.now();

            ReminderList list = new ReminderList("업무", "#007AFF", "💼");

            var after = java.time.LocalDateTime.now();
            assertThat(list.getCreatedAt()).isNotNull();
            assertThat(list.getCreatedAt()).isAfterOrEqualTo(before);
            assertThat(list.getCreatedAt()).isBeforeOrEqualTo(after);
        }

        @Test
        @DisplayName("기본 생성자로 생성하면 reminders가 빈 리스트다")
        void defaultConstructorHasEmptyReminders() {
            ReminderList list = new ReminderList();

            assertThat(list.getReminders()).isNotNull();
            assertThat(list.getReminders()).isEmpty();
        }

        @Test
        @DisplayName("기본 생성자로 생성하면 createdAt이 null이다")
        void defaultConstructorCreatedAtIsNull() {
            ReminderList list = new ReminderList();

            assertThat(list.getCreatedAt()).isNull();
        }

        @Test
        @DisplayName("color, icon 없이 name만으로 생성할 수 있다")
        void createWithNameOnly() {
            ReminderList list = new ReminderList("개인", null, null);

            assertThat(list.getName()).isEqualTo("개인");
            assertThat(list.getColor()).isNull();
            assertThat(list.getIcon()).isNull();
        }
    }

    @Nested
    @DisplayName("update()")
    class Update {

        @Test
        @DisplayName("name을 변경할 수 있다")
        void updateName() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");

            list.update("개인", "#007AFF", "💼");

            assertThat(list.getName()).isEqualTo("개인");
        }

        @Test
        @DisplayName("color를 변경할 수 있다")
        void updateColor() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");

            list.update("업무", "#FF3B30", "💼");

            assertThat(list.getColor()).isEqualTo("#FF3B30");
        }

        @Test
        @DisplayName("icon을 변경할 수 있다")
        void updateIcon() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");

            list.update("업무", "#007AFF", "🏠");

            assertThat(list.getIcon()).isEqualTo("🏠");
        }

        @Test
        @DisplayName("name, color, icon을 한 번에 변경할 수 있다")
        void updateAllFields() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");

            list.update("쇼핑", "#FF9500", "🛒");

            assertThat(list.getName()).isEqualTo("쇼핑");
            assertThat(list.getColor()).isEqualTo("#FF9500");
            assertThat(list.getIcon()).isEqualTo("🛒");
        }

        @Test
        @DisplayName("update 후에도 createdAt은 변경되지 않는다")
        void createdAtDoesNotChangeOnUpdate() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");
            var originalCreatedAt = list.getCreatedAt();

            list.update("변경된 이름", "#FF3B30", "🏠");

            assertThat(list.getCreatedAt()).isEqualTo(originalCreatedAt);
        }
    }

    @Nested
    @DisplayName("Reminder 연관관계")
    class ReminderAssociation {

        @Test
        @DisplayName("Reminder를 추가하면 reminders 목록에 포함된다")
        void addReminderToList() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");
            Reminder reminder = new Reminder("보고서 작성");
            reminder.assignTo(list);
            list.getReminders().add(reminder);

            assertThat(list.getReminders()).hasSize(1);
            assertThat(list.getReminders().get(0).getTitle()).isEqualTo("보고서 작성");
        }

        @Test
        @DisplayName("Reminder의 reminderList가 올바르게 설정된다")
        void reminderKnowsItsParentList() {
            ReminderList list = new ReminderList("업무", "#007AFF", "💼");
            Reminder reminder = new Reminder("보고서 작성");

            reminder.assignTo(list);

            assertThat(reminder.getReminderList()).isEqualTo(list);
        }
    }
}
