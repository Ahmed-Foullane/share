package net.ahmed.youshar.post.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.user.entity.Student;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String description;

    private Integer votes;

    private LocalDateTime date;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL)
    private List<Comment> comments;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Student author;
}