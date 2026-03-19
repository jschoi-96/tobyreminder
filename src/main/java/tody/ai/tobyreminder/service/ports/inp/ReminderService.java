package tody.ai.tobyreminder.service.ports.inp;

import tody.ai.tobyreminder.domain.Priority;
import tody.ai.tobyreminder.domain.Reminder;

import java.time.OffsetDateTime;
import java.util.List;

public interface ReminderService {

    List<Reminder> findAll(Long listId, String filter);

    Reminder findById(Long id);

    Reminder create(String title, Long listId);

    Reminder update(Long id, String title, String notes, OffsetDateTime dueDate, Priority priority, Long listId);

    Reminder toggleComplete(Long id);

    void delete(Long id);
}
