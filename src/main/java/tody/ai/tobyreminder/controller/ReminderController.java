package tody.ai.tobyreminder.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tody.ai.tobyreminder.domain.Reminder;
import tody.ai.tobyreminder.service.ReminderService;

import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public List<Reminder> getAll() {
        return reminderService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getById(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Reminder> create(@RequestBody Reminder reminder) {
        return ResponseEntity.ok(reminderService.save(reminder));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Reminder> complete(@PathVariable Long id) {
        return ResponseEntity.ok(reminderService.complete(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reminderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
