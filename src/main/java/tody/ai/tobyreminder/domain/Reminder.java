package tody.ai.tobyreminder.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
@Getter
@NoArgsConstructor
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String notes;

    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.NONE;

    private boolean completed = false;

    private LocalDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_list_id")
    private ReminderList reminderList;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Reminder(String title) {
        this.title = title;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void update(String title, String notes, LocalDateTime dueDate, Priority priority, ReminderList reminderList) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.reminderList = reminderList;
        this.updatedAt = LocalDateTime.now();
    }

    public void complete() {
        this.completed = true;
        this.completedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void uncomplete() {
        this.completed = false;
        this.completedAt = null;
        this.updatedAt = LocalDateTime.now();
    }

    public void assignTo(ReminderList reminderList) {
        this.reminderList = reminderList;
        this.updatedAt = LocalDateTime.now();
    }
}
