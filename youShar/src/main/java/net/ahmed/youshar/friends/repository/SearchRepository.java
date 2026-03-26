package net.ahmed.youshar.friends.repository;

import net.ahmed.youshar.friends.entity.Search;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SearchRepository extends JpaRepository<Search, Long> {
    List<Search> findByTextContainingIgnoreCase(String text);
}
