package tody.ai.tobyreminder.controller.dto;

import tody.ai.tobyreminder.domain.Priority;
import tody.ai.tobyreminder.domain.Reminder;

import java.time.OffsetDateTime;

public record ReminderResponse(
        Long id,
        String title,
        String notes,
        OffsetDateTime dueDate,
        Priority priority,
        boolean completed,
        OffsetDateTime completedAt,
        Long listId,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {
    public static ReminderResponse from(Reminder reminder) {
        return new ReminderResponse(
                reminder.getId(),
                reminder.getTitle(),
                reminder.getNotes(),
                reminder.getDueDate(),
                reminder.getPriority(),
                reminder.isCompleted(),
                reminder.getCompletedAt(),
                reminder.getReminderList() != null ? reminder.getReminderList().getId() : null,
                reminder.getCreatedAt(),
                reminder.getUpdatedAt()
        );
    }
}
