package net.ahmed.youshar.messages.mapper;

import net.ahmed.youshar.messages.DTO.requestDTO.MessageRequestDTO;
import net.ahmed.youshar.messages.DTO.responseDTO.MessageResponseDTO;
import net.ahmed.youshar.messages.entity.Message;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    @Mapping(source = "receiverId", target = "receiver.id")
    Message toEntity(MessageRequestDTO messageRequestDTO);

    @Mapping(source = "sender.id", target = "senderId")
    @Mapping(source = "receiver.id", target = "receiverId")
    MessageResponseDTO toResponseDTO(Message message);
}
