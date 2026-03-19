package tody.ai.tobyreminder.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

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

    private OffsetDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.NONE;

    private boolean completed = false;

    private OffsetDateTime completedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reminder_list_id")
    private ReminderList reminderList;

    @Column(updatable = false)
    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    public Reminder(String title) {
        this.title = title;
        this.createdAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public void update(String title, String notes, OffsetDateTime dueDate, Priority priority, ReminderList reminderList) {
        this.title = title;
        this.notes = notes;
        this.dueDate = dueDate;
        this.priority = priority;
        this.reminderList = reminderList;
        this.updatedAt = OffsetDateTime.now();
    }

    public void complete() {
        this.completed = true;
        this.completedAt = OffsetDateTime.now();
        this.updatedAt = OffsetDateTime.now();
    }

    public void uncomplete() {
        this.completed = false;
        this.completedAt = null;
        this.updatedAt = OffsetDateTime.now();
    }

    public void assignTo(ReminderList reminderList) {
        this.reminderList = reminderList;
        this.updatedAt = OffsetDateTime.now();
    }
}
