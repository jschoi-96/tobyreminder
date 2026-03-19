package tody.ai.tobyreminder.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
class GlobalExceptionHandlerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Nested
    @DisplayName("유효성 검사 실패")
    class ValidationError {

        @Test
        @DisplayName("title이 blank이면 400을 반환한다")
        void returns400WhenTitleBlank() throws Exception {
            mockMvc.perform(post("/api/reminders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ \"title\": \"\" }"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400))
                    .andExpect(jsonPath("$.error").value("Bad Request"));
        }

        @Test
        @DisplayName("body가 없으면 400을 반환한다")
        void returns400WhenBodyMissing() throws Exception {
            mockMvc.perform(post("/api/reminders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{}"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.status").value(400));
        }

        @Test
        @DisplayName("400 응답에 timestamp와 message 필드가 포함된다")
        void returns400WithTimestampAndMessage() throws Exception {
            mockMvc.perform(post("/api/reminders")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{ \"title\": \"\" }"))
                    .andExpect(status().isBadRequest())
                    .andExpect(jsonPath("$.timestamp").isNotEmpty())
                    .andExpect(jsonPath("$.message").isNotEmpty());
        }
    }

    @Nested
    @DisplayName("존재하지 않는 리소스")
    class NotFound {

        @Test
        @DisplayName("존재하지 않는 reminder 조회 시 404를 반환한다")
        void returns404ForMissingReminder() throws Exception {
            mockMvc.perform(get("/api/reminders/99999"))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message", containsString("99999")));
        }
    }
}
