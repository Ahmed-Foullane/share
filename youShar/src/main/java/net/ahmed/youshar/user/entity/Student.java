package net.ahmed.youshar.user.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.friends.entity.Search;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private AppUser user;

    private Integer promotionYear;

    @ManyToMany
    @JoinTable(
            name = "student_search_history",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "search_id")
    )
    private List<Search> searchHistory;

    private Integer score;

    private LocalDateTime createdAt;

    @ManyToMany
    @JoinTable(
            name = "student_sent_requests",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<AppUser> sendedRequests;

    @ManyToMany
    @JoinTable(
            name = "student_received_requests",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<AppUser> receivedRequests;

    @ManyToMany
    @JoinTable(
            name = "student_friends",
            joinColumns = @JoinColumn(name = "student_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<AppUser> friends;
}
