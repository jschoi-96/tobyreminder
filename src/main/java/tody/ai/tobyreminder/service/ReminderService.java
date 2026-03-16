package tody.ai.tobyreminder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tody.ai.tobyreminder.entity.Reminder;
import tody.ai.tobyreminder.repository.ReminderRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReminderService {

    private final ReminderRepository reminderRepository;

    public List<Reminder> findAll() {
        return reminderRepository.findAll();
    }

    public Reminder findById(Long id) {
        return reminderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reminder not found: " + id));
    }

    @Transactional
    public Reminder save(Reminder reminder) {
        return reminderRepository.save(reminder);
    }

    @Transactional
    public Reminder complete(Long id) {
        Reminder reminder = findById(id);
        reminder.setCompleted(true);
        return reminder;
    }

    @Transactional
    public void delete(Long id) {
        reminderRepository.deleteById(id);
    }
}
