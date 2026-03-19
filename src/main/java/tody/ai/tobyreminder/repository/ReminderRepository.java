package tody.ai.tobyreminder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tody.ai.tobyreminder.domain.Reminder;

import java.time.OffsetDateTime;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {

    List<Reminder> findByReminderListId(Long listId);

    List<Reminder> findByCompleted(boolean completed);

    @Query("SELECT r FROM Reminder r WHERE r.dueDate BETWEEN :start AND :end")
    List<Reminder> findToday(@Param("start") OffsetDateTime start, @Param("end") OffsetDateTime end);

    @Query("SELECT r FROM Reminder r WHERE r.dueDate > :now AND r.completed = false")
    List<Reminder> findScheduled(@Param("now") OffsetDateTime now);
}
