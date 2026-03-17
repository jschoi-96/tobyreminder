package tody.ai.tobyreminder.controller.dto;

import tody.ai.tobyreminder.domain.ReminderList;

import java.time.LocalDateTime;

public record ReminderListResponse(
        Long id,
        String name,
        String color,
        String icon,
        LocalDateTime createdAt
) {
    public static ReminderListResponse from(ReminderList reminderList) {
        return new ReminderListResponse(
                reminderList.getId(),
                reminderList.getName(),
                reminderList.getColor(),
                reminderList.getIcon(),
                reminderList.getCreatedAt()
        );
    }
}
