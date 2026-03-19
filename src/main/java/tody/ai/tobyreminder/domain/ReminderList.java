package tody.ai.tobyreminder.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reminder_lists")
@Getter
@NoArgsConstructor
public class ReminderList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 7)
    private String color;

    private String icon;

    @OneToMany(mappedBy = "reminderList", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reminder> reminders = new ArrayList<>();

    @Column(updatable = false)
    private OffsetDateTime createdAt;

    public ReminderList(String name, String color, String icon) {
        this.name = name;
        this.color = color;
        this.icon = icon;
        this.createdAt = OffsetDateTime.now();
    }

    public void update(String name, String color, String icon) {
        this.name = name;
        this.color = color;
        this.icon = icon;
    }
}
