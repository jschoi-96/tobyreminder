package tody.ai.tobyreminder.controller.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReminderListRequest {

    @NotBlank
    private String name;

    private String color;

    private String icon;
}
