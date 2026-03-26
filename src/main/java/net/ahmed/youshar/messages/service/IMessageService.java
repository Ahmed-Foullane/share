package net.ahmed.youshar.messages.service;

import net.ahmed.youshar.messages.DTO.requestDTO.MessageRequestDTO;
import net.ahmed.youshar.messages.DTO.responseDTO.MessageResponseDTO;

import java.util.List;

public interface IMessageService {
    MessageResponseDTO send(MessageRequestDTO dto, Integer senderId);
    List<MessageResponseDTO> getConversation(Integer userId1, Integer userId2);
    List<MessageResponseDTO> getConversationsByUser(Integer userId);
    List<MessageResponseDTO> getUnreadMessages(Integer receiverId);
    MessageResponseDTO markAsRead(Integer messageId);
    void delete(Integer id);
}
