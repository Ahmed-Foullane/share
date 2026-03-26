package net.ahmed.youshar.post.repository;

import net.ahmed.youshar.post.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    List<Question> findByAuthorId(Integer authorId);
    List<Question> findByTitleContainingIgnoreCase(String title);
}
