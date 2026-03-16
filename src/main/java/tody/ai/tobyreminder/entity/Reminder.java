package tody.ai.tobyreminder.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reminders")
@Getter
@Setter
@NoArgsConstructor
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    private LocalDateTime reminderAt;

    private boolean completed = false;

    public Reminder(String title, String description, LocalDateTime reminderAt) {
        this.title = title;
        this.description = description;
        this.reminderAt = reminderAt;
    }
}
