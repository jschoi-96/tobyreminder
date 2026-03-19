package tody.ai.tobyreminder.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import tody.ai.tobyreminder.domain.Priority;

import java.time.OffsetDateTime;

@Getter
@NoArgsConstructor
public class ReminderRequest {

    @NotBlank
    private String title;

    private String notes;

    private OffsetDateTime dueDate;

    private Priority priority;

    private Long listId;
}
