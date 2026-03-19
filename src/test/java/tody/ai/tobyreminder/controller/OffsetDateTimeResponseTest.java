package tody.ai.tobyreminder.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import tody.ai.tobyreminder.service.ports.inp.ReminderListService;
import tody.ai.tobyreminder.service.ports.inp.ReminderService;

import static org.hamcrest.Matchers.matchesPattern;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Transactional
@DisplayName("날짜 필드 타임존 오프셋 직렬화")
class OffsetDateTimeResponseTest {

    // ISO-8601 오프셋 패턴: 2026-03-19T16:46:13+09:00 또는 2026-03-19T07:46:13Z
    private static final String OFFSET_PATTERN =
            "\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(Z|[+-]\\d{2}:\\d{2})";

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private ReminderListService reminderListService;

    @Autowired
    private ReminderService reminderService;

    private Long listId;
    private Long reminderId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        listId = reminderListService.create("업무", "#007AFF", "💼").getId();
        reminderId = reminderService.create("할 일", listId).getId();
    }

    @Test
    @DisplayName("ReminderList createdAt에 타임존 오프셋이 포함된다")
    void reminderListCreatedAtContainsOffset() throws Exception {
        mockMvc.perform(get("/api/lists/{id}", listId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.createdAt", matchesPattern(OFFSET_PATTERN)));
    }

    @Test
    @DisplayName("Reminder createdAt에 타임존 오프셋이 포함된다")
    void reminderCreatedAtContainsOffset() throws Exception {
        mockMvc.perform(get("/api/reminders/{id}", reminderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.createdAt", matchesPattern(OFFSET_PATTERN)));
    }

    @Test
    @DisplayName("Reminder updatedAt에 타임존 오프셋이 포함된다")
    void reminderUpdatedAtContainsOffset() throws Exception {
        mockMvc.perform(get("/api/reminders/{id}", reminderId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.updatedAt", matchesPattern(OFFSET_PATTERN)));
    }
}
