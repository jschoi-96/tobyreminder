package tody.ai.tobyreminder.ports.inp;

import tody.ai.tobyreminder.domain.ReminderList;

import java.util.List;

public interface ReminderListService {

    List<ReminderList> findAll();

    ReminderList findById(Long id);

    ReminderList create(String name, String color, String icon);

    ReminderList update(Long id, String name, String color, String icon);

    void delete(Long id);
}
