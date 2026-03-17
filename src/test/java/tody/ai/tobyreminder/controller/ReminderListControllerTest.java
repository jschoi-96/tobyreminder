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
import tody.ai.tobyreminder.service.ports.inp.ReminderListService;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
class ReminderListControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @Autowired
    private ReminderListService reminderListService;

    private Long savedId;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
        savedId = reminderListService.create("업무", "#007AFF", "💼").getId();
    }

    @Nested
    @DisplayName("GET /api/lists")
    class GetAll {

        @Test
        @DisplayName("전체 목록을 200으로 반환한다")
        void returns200WithAllLists() throws Exception {
            mockMvc.perform(get("/api/lists"))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                    .andExpect(jsonPath("$[0].name").value("업무"))
                    .andExpect(jsonPath("$[0].color").value("#007AFF"))
                    .andExpect(jsonPath("$[0].icon").value("💼"));
        }
    }

    @Nested
    @DisplayName("GET /api/lists/{id}")
    class GetById {

        @Test
        @DisplayName("존재하는 id로 조회하면 200을 반환한다")
        void returns200WhenFound() throws Exception {
            mockMvc.perform(get("/api/lists/{id}", savedId))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.id").value(savedId))
                    .andExpect(jsonPath("$.name").value("업무"))
                    .andExpect(jsonPath("$.color").value("#007AFF"))
                    .andExpect(jsonPath("$.icon").value("💼"))
                    .andExpect(jsonPath("$.createdAt").isNotEmpty());
        }

        @Test
        @DisplayName("존재하지 않는 id로 조회하면 404를 반환한다")
        void returns404WhenNotFound() throws Exception {
            mockMvc.perform(get("/api/lists/{id}", 999L))
                    .andExpect(status().isNotFound())
                    .andExpect(jsonPath("$.status").value(404))
                    .andExpect(jsonPath("$.message", containsString("999")));
        }
    }

    @Nested
    @DisplayName("POST /api/lists")
    class Create {

        @Test
        @DisplayName("유효한 요청으로 생성하면 201과 Location 헤더를 반환한다")
        void returns201WithLocation() throws Exception {
            String body = """
                    { "name": "개인", "color": "#FF3B30", "icon": "🏠" }
                    """;
            mockMvc.perform(post("/api/lists")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isCreated())
                    .andExpect(header().string("Location", containsString("/api/lists/")))
                    .andExpect(jsonPath("$.name").value("개인"))
                    .andExpect(jsonPath("$.color").value("#FF3B30"))
                    .andExpect(jsonPath("$.id").isNumber());
        }

        @Test
        @DisplayName("name이 없으면 400을 반환한다")
        void returns400WhenNameBlank() throws Exception {
            String body = """
                    { "color": "#FF3B30", "icon": "🏠" }
                    """;
            mockMvc.perform(post("/api/lists")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isBadRequest());
        }
    }

    @Nested
    @DisplayName("PUT /api/lists/{id}")
    class Update {

        @Test
        @DisplayName("유효한 요청으로 수정하면 200을 반환한다")
        void returns200OnUpdate() throws Exception {
            String body = """
                    { "name": "쇼핑", "color": "#FF9500", "icon": "🛒" }
                    """;
            mockMvc.perform(put("/api/lists/{id}", savedId)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.name").value("쇼핑"))
                    .andExpect(jsonPath("$.color").value("#FF9500"))
                    .andExpect(jsonPath("$.icon").value("🛒"));
        }

        @Test
        @DisplayName("존재하지 않는 id로 수정하면 404를 반환한다")
        void returns404WhenNotFound() throws Exception {
            String body = """
                    { "name": "쇼핑" }
                    """;
            mockMvc.perform(put("/api/lists/{id}", 999L)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(body))
                    .andExpect(status().isNotFound());
        }
    }

    @Nested
    @DisplayName("DELETE /api/lists/{id}")
    class Delete {

        @Test
        @DisplayName("존재하는 id를 삭제하면 204를 반환한다")
        void returns204OnDelete() throws Exception {
            mockMvc.perform(delete("/api/lists/{id}", savedId))
                    .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName("존재하지 않는 id를 삭제하면 404를 반환한다")
        void returns404WhenNotFound() throws Exception {
            mockMvc.perform(delete("/api/lists/{id}", 999L))
                    .andExpect(status().isNotFound());
        }
    }
}
