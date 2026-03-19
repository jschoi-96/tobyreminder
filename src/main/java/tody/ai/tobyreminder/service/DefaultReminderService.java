package tody.ai.tobyreminder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tody.ai.tobyreminder.domain.Priority;
import tody.ai.tobyreminder.domain.Reminder;
import tody.ai.tobyreminder.domain.ReminderList;
import tody.ai.tobyreminder.exception.ResourceNotFoundException;
import tody.ai.tobyreminder.repository.ReminderListRepository;
import tody.ai.tobyreminder.repository.ReminderRepository;
import tody.ai.tobyreminder.service.ports.inp.ReminderService;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderService implements ReminderService {

    private final ReminderRepository reminderRepository;
    private final ReminderListRepository reminderListRepository;

    @Override
    public List<Reminder> findAll(Long listId, String filter) {
        if (listId != null) {
            return reminderRepository.findByReminderListId(listId);
        }
        return switch (filter == null ? "" : filter) {
            case "today" -> {
                ZoneId zone = ZoneId.systemDefault();
                OffsetDateTime start = OffsetDateTime.now(zone).toLocalDate().atStartOfDay(zone).toOffsetDateTime();
                OffsetDateTime end = start.plusDays(1).minusSeconds(1);
                yield reminderRepository.findToday(start, end);
            }
            case "scheduled" -> reminderRepository.findScheduled(OffsetDateTime.now());
            case "completed" -> reminderRepository.findByCompleted(true);
            default -> reminderRepository.findAll();
        };
    }

    @Override
    public Reminder findById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reminder", id));
    }

    @Override
    @Transactional
    public Reminder create(String title, Long listId) {
        Reminder reminder = new Reminder(title);
        if (listId != null) {
            ReminderList reminderList = reminderListRepository.findById(listId)
                    .orElseThrow(() -> new ResourceNotFoundException("ReminderList", listId));
            reminder.assignTo(reminderList);
        }
        return reminderRepository.save(reminder);
    }

    @Override
    @Transactional
    public Reminder update(Long id, String title, String notes, OffsetDateTime dueDate, Priority priority, Long listId) {
        Reminder reminder = findById(id);
        ReminderList reminderList = listId != null
                ? reminderListRepository.findById(listId)
                        .orElseThrow(() -> new ResourceNotFoundException("ReminderList", listId))
                : null;
        reminder.update(title, notes, dueDate, priority, reminderList);
        return reminder;
    }

    @Override
    @Transactional
    public Reminder toggleComplete(Long id) {
        Reminder reminder = findById(id);
        if (reminder.isCompleted()) {
            reminder.uncomplete();
        } else {
            reminder.complete();
        }
        return reminder;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Reminder reminder = findById(id);
        reminderRepository.delete(reminder);
    }
}
