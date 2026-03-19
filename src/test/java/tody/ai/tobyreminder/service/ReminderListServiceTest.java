package tody.ai.tobyreminder.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import tody.ai.tobyreminder.domain.ReminderList;
import tody.ai.tobyreminder.service.ports.inp.ReminderListService;

import java.util.List;

import tody.ai.tobyreminder.exception.ResourceNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class ReminderListServiceTest {

    @Autowired
    private ReminderListService reminderListService; // 인터페이스로 주입, 실제 구현체는 ReminderListServiceImpl

    @Nested
    @DisplayName("findAll()")
    class FindAll {

        @Test
        @DisplayName("저장된 전체 목록을 반환한다")
        void returnsAllLists() {
            reminderListService.create("업무", "#007AFF", "💼");
            reminderListService.create("개인", "#FF3B30", "🏠");

            List<ReminderList> result = reminderListService.findAll();

            assertThat(result).hasSize(2);
            assertThat(result).extracting(ReminderList::getName)
                    .containsExactlyInAnyOrder("업무", "개인");
        }

        @Test
        @DisplayName("목록이 없으면 빈 리스트를 반환한다")
        void returnsEmptyListWhenNoneExist() {
            List<ReminderList> result = reminderListService.findAll();

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("findById()")
    class FindById {

        @Test
        @DisplayName("존재하는 id로 조회하면 ReminderList를 반환한다")
        void returnsReminderListWhenFound() {
            ReminderList saved = reminderListService.create("업무", "#007AFF", "💼");

            ReminderList result = reminderListService.findById(saved.getId());

            assertThat(result.getName()).isEqualTo("업무");
            assertThat(result.getColor()).isEqualTo("#007AFF");
            assertThat(result.getIcon()).isEqualTo("💼");
        }

        @Test
        @DisplayName("존재하지 않는 id로 조회하면 예외가 발생한다")
        void throwsWhenNotFound() {
            assertThatThrownBy(() -> reminderListService.findById(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("999");
        }
    }

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        @DisplayName("name, color, icon으로 ReminderList를 생성한다")
        void createsReminderList() {
            ReminderList result = reminderListService.create("업무", "#007AFF", "💼");

            assertThat(result.getId()).isNotNull();
            assertThat(result.getName()).isEqualTo("업무");
            assertThat(result.getColor()).isEqualTo("#007AFF");
            assertThat(result.getIcon()).isEqualTo("💼");
        }

        @Test
        @DisplayName("생성 시 createdAt이 자동으로 설정된다")
        void createdAtIsSetOnCreate() {
            ReminderList result = reminderListService.create("업무", "#007AFF", "💼");

            assertThat(result.getCreatedAt()).isNotNull();
        }

        @Test
        @DisplayName("color, icon 없이 name만으로 생성할 수 있다")
        void createsWithNameOnly() {
            ReminderList result = reminderListService.create("업무", null, null);

            assertThat(result.getName()).isEqualTo("업무");
            assertThat(result.getColor()).isNull();
            assertThat(result.getIcon()).isNull();
        }
    }

    @Nested
    @DisplayName("update()")
    class Update {

        @Test
        @DisplayName("name, color, icon을 변경한다")
        void updatesAllFields() {
            ReminderList saved = reminderListService.create("업무", "#007AFF", "💼");

            ReminderList result = reminderListService.update(saved.getId(), "쇼핑", "#FF9500", "🛒");

            assertThat(result.getName()).isEqualTo("쇼핑");
            assertThat(result.getColor()).isEqualTo("#FF9500");
            assertThat(result.getIcon()).isEqualTo("🛒");
        }

        @Test
        @DisplayName("update 후에도 createdAt은 변경되지 않는다")
        void createdAtUnchangedAfterUpdate() {
            ReminderList saved = reminderListService.create("업무", "#007AFF", "💼");
            var originalCreatedAt = saved.getCreatedAt();

            reminderListService.update(saved.getId(), "쇼핑", "#FF9500", "🛒");

            ReminderList updated = reminderListService.findById(saved.getId());
            assertThat(updated.getCreatedAt()).isEqualTo(originalCreatedAt);
        }

        @Test
        @DisplayName("존재하지 않는 id로 수정하면 예외가 발생한다")
        void throwsWhenNotFound() {
            assertThatThrownBy(() -> reminderListService.update(999L, "쇼핑", "#FF9500", "🛒"))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("999");
        }
    }

    @Nested
    @DisplayName("delete()")
    class Delete {

        @Test
        @DisplayName("삭제 후 조회하면 예외가 발생한다")
        void deletedListCannotBeFound() {
            ReminderList saved = reminderListService.create("업무", "#007AFF", "💼");
            Long id = saved.getId();

            reminderListService.delete(id);

            assertThatThrownBy(() -> reminderListService.findById(id))
                    .isInstanceOf(ResourceNotFoundException.class);
        }

        @Test
        @DisplayName("삭제 후 전체 목록에서 제외된다")
        void deletedListNotInFindAll() {
            ReminderList saved = reminderListService.create("업무", "#007AFF", "💼");

            reminderListService.delete(saved.getId());

            assertThat(reminderListService.findAll()).isEmpty();
        }

        @Test
        @DisplayName("존재하지 않는 id로 삭제하면 예외가 발생한다")
        void throwsWhenNotFound() {
            assertThatThrownBy(() -> reminderListService.delete(999L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("999");
        }
    }
}
