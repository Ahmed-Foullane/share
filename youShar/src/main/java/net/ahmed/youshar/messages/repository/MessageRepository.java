package net.ahmed.youshar.messages.repository;

import net.ahmed.youshar.messages.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Integer> {
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByIdAsc(
            Integer senderId1, Integer receiverId1, Integer receiverId2, Integer senderId2);

    List<Message> findByReceiverIdAndIsReadFalse(Integer receiverId);

    @Query("SELECT m FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId ORDER BY m.id DESC")
    List<Message> findConversationsByUserId(@Param("userId") Integer userId);
}
