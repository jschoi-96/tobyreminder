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
import tody.ai.tobyreminder.exception.ResourceNotFoundException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
class ResourceNotFoundExceptionTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext wac;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(wac).build();
    }

    @Test
    @DisplayName("ResourceNotFoundException은 RuntimeException을 상속한다")
    void extendsRuntimeException() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Reminder", 99L);
        assertThat(ex).isInstanceOf(RuntimeException.class);
    }

    @Test
    @DisplayName("ResourceNotFoundException 메시지에 리소스명과 id가 포함된다")
    void messageContainsResourceNameAndId() {
        ResourceNotFoundException ex = new ResourceNotFoundException("Reminder", 42L);
        assertThat(ex.getMessage()).contains("Reminder").contains("42");
    }

    @Test
    @DisplayName("존재하지 않는 reminder 조회 시 404와 ResourceNotFoundException 메시지를 반환한다")
    void returns404WithResourceNotFoundMessage() throws Exception {
        mockMvc.perform(get("/api/reminders/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("Reminder")))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("99999")));
    }

    @Test
    @DisplayName("존재하지 않는 list 조회 시 404와 ResourceNotFoundException 메시지를 반환한다")
    void returns404WithResourceNotFoundMessageForList() throws Exception {
        mockMvc.perform(get("/api/lists/99999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value(org.hamcrest.Matchers.containsString("ReminderList")));
    }
}
