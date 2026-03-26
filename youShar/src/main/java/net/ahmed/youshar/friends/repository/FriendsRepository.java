package net.ahmed.youshar.friends.repository;

import net.ahmed.youshar.friends.entity.Friends;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendsRepository extends JpaRepository<Friends, Integer> {
    List<Friends> findByUserId(Long userId);
    List<Friends> findByFriendId(Long friendId);
    Optional<Friends> findByUserIdAndFriendId(Long userId, Long friendId);
    boolean existsByUserIdAndFriendId(Long userId, Long friendId);
}
