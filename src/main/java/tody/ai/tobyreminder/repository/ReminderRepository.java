package tody.ai.tobyreminder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tody.ai.tobyreminder.entity.Reminder;

import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByCompleted(boolean completed);
}
