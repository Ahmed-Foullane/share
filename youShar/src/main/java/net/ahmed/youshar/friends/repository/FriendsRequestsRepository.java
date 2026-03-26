package net.ahmed.youshar.friends.repository;

import net.ahmed.youshar.friends.entity.FriendsRequests;
import net.ahmed.youshar.friends.enume.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendsRequestsRepository extends JpaRepository<FriendsRequests, Integer> {
    List<FriendsRequests> findByStatus(RequestStatus status);
    List<FriendsRequests> findByType(net.ahmed.youshar.friends.enume.RequestType type);
}
