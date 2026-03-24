package net.ahmed.youshar.messages.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.messages.DTO.requestDTO.MessageRequestDTO;
import net.ahmed.youshar.messages.DTO.responseDTO.MessageResponseDTO;
import net.ahmed.youshar.messages.entity.Message;
import net.ahmed.youshar.messages.exception.MessageNotFoundException;
import net.ahmed.youshar.messages.mapper.MessageMapper;
import net.ahmed.youshar.messages.repository.MessageRepository;
import net.ahmed.youshar.messages.service.IMessageService;
import net.ahmed.youshar.user.entity.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageServiceImpl implements IMessageService {

    private final MessageRepository messageRepository;
    private final MessageMapper messageMapper;

    @Override
    @Transactional
    public MessageResponseDTO send(MessageRequestDTO dto, Integer senderId) {
        Message message = messageMapper.toEntity(dto);
        Student sender = new Student();
        sender.setId(senderId);
        message.setSender(sender);
        message.setIsRead(false);
        Message saved = messageRepository.save(message);
        return messageMapper.toResponseDTO(saved);
    }

    @Override
    public List<MessageResponseDTO> getConversation(Integer userId1, Integer userId2) {
        return messageRepository
                .findBySenderIdAndReceiverIdOrReceiverIdAndSenderIdOrderByIdAsc(userId1, userId2, userId1, userId2)
                .stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponseDTO> getConversationsByUser(Integer userId) {
        return messageRepository.findConversationsByUserId(userId).stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MessageResponseDTO> getUnreadMessages(Integer receiverId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(receiverId).stream()
                .map(messageMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MessageResponseDTO markAsRead(Integer messageId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new MessageNotFoundException(messageId));
        message.setIsRead(true);
        Message updated = messageRepository.save(message);
        return messageMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!messageRepository.existsById(id)) {
            throw new MessageNotFoundException(id);
        }
        messageRepository.deleteById(id);
    }
}
