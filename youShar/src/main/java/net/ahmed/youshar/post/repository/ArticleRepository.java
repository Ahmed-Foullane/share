package net.ahmed.youshar.post.repository;

import net.ahmed.youshar.post.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    List<Article> findByCategoryId(Integer categoryId);
    List<Article> findByAuthorId(Integer authorId);
    List<Article> findByTitleContainingIgnoreCase(String title);
}
