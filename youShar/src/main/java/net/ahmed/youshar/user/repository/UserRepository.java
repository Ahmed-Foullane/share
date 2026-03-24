package net.ahmed.youshar.user.repository;

import net.ahmed.youshar.user.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findUserByEmailContainingIgnoreCase(String email);
}
