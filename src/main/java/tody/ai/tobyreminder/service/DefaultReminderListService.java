package tody.ai.tobyreminder.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tody.ai.tobyreminder.domain.ReminderList;
import tody.ai.tobyreminder.exception.ResourceNotFoundException;
import tody.ai.tobyreminder.service.ports.inp.ReminderListService;
import tody.ai.tobyreminder.repository.ReminderListRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DefaultReminderListService implements ReminderListService {

    private final ReminderListRepository reminderListRepository;

    @Override
    public List<ReminderList> findAll() {
        return reminderListRepository.findAll();
    }

    @Override
    public ReminderList findById(Long id) {
        return reminderListRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ReminderList", id));
    }

    @Override
    @Transactional
    public ReminderList create(String name, String color, String icon) {
        ReminderList reminderList = new ReminderList(name, color, icon);
        return reminderListRepository.save(reminderList);
    }

    @Override
    @Transactional
    public ReminderList update(Long id, String name, String color, String icon) {
        ReminderList reminderList = findById(id);
        reminderList.update(name, color, icon);
        return reminderList;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ReminderList reminderList = findById(id);
        reminderListRepository.delete(reminderList);
    }
}
