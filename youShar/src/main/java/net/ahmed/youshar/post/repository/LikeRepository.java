package net.ahmed.youshar.post.repository;

import net.ahmed.youshar.post.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Integer> {
    Optional<Like> findByLikeableTypeAndLikeableIdAndStudentId(String likeableType, Integer likeableId, Integer studentId);
    List<Like> findByLikeableTypeAndLikeableId(String likeableType, Integer likeableId);
    long countByLikeableTypeAndLikeableId(String likeableType, Integer likeableId);
}
