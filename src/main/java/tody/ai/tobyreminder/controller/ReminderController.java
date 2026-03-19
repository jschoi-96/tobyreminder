package tody.ai.tobyreminder.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tody.ai.tobyreminder.controller.dto.ReminderRequest;
import tody.ai.tobyreminder.controller.dto.ReminderResponse;
import tody.ai.tobyreminder.service.ports.inp.ReminderService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/reminders")
@RequiredArgsConstructor
public class ReminderController {

    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<List<ReminderResponse>> getAll(
            @RequestParam(required = false) Long listId,
            @RequestParam(required = false) String filter
    ) {
        List<ReminderResponse> response = reminderService.findAll(listId, filter)
                .stream()
                .map(ReminderResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ReminderResponse.from(reminderService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ReminderResponse> create(@Valid @RequestBody ReminderRequest request) {
        ReminderResponse response = ReminderResponse.from(
                reminderService.create(request.getTitle(), request.getListId())
        );
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ReminderRequest request
    ) {
        return ResponseEntity.ok(ReminderResponse.from(
                reminderService.update(id, request.getTitle(), request.getNotes(),
                        request.getDueDate(), request.getPriority(), request.getListId())
        ));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<ReminderResponse> toggleComplete(@PathVariable Long id) {
        return ResponseEntity.ok(ReminderResponse.from(reminderService.toggleComplete(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reminderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
