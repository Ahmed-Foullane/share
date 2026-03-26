package net.ahmed.youshar.post.entity;


import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.user.entity.Student;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String title;

    private String content;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "article_tags",
            joinColumns = @JoinColumn(name = "article_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private List<Tag> tags;

    private Integer likes;

    private LocalDateTime date;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Student author;
}
