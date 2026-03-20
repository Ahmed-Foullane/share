package net.ahmed.youshar.post.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.user.entity.Student;

@Entity
@Table(name = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Polymorphic association: "article", "question", "comment".
    private String likeableType;

    private Integer likeableId;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;
}

