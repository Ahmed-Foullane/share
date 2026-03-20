package net.ahmed.youshar.post.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.user.entity.Student;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    private Boolean isAccepted;

    private Integer votes;

    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Student author;
}
