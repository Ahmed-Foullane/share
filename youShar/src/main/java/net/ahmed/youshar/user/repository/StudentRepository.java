package net.ahmed.youshar.user.repository;

import net.ahmed.youshar.user.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByUserId(Long userId);
}
