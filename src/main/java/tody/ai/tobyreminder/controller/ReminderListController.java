package tody.ai.tobyreminder.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tody.ai.tobyreminder.controller.dto.ReminderListRequest;
import tody.ai.tobyreminder.controller.dto.ReminderListResponse;
import tody.ai.tobyreminder.service.ports.inp.ReminderListService;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/lists")
@RequiredArgsConstructor
public class ReminderListController {

    private final ReminderListService reminderListService;

    @GetMapping
    public ResponseEntity<List<ReminderListResponse>> getAll() {
        List<ReminderListResponse> response = reminderListService.findAll()
                .stream()
                .map(ReminderListResponse::from)
                .toList();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReminderListResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ReminderListResponse.from(reminderListService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<ReminderListResponse> create(@Valid @RequestBody ReminderListRequest request) {
        ReminderListResponse response = ReminderListResponse.from(
                reminderListService.create(request.getName(), request.getColor(), request.getIcon())
        );
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(location).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReminderListResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ReminderListRequest request
    ) {
        return ResponseEntity.ok(ReminderListResponse.from(
                reminderListService.update(id, request.getName(), request.getColor(), request.getIcon())
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reminderListService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
