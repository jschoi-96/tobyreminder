package tody.ai.tobyreminder.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tody.ai.tobyreminder.domain.ReminderList;

public interface ReminderListRepository extends JpaRepository<ReminderList, Long> {
}
