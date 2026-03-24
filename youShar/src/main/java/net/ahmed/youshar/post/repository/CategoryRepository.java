package net.ahmed.youshar.post.repository;

import net.ahmed.youshar.post.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByNameIgnoreCase(String name);
}
