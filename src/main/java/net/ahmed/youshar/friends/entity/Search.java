package net.ahmed.youshar.friends.entity;

import jakarta.persistence.*;
import net.ahmed.youshar.user.entity.Student;

@Entity
public class Search {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String text;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

}
