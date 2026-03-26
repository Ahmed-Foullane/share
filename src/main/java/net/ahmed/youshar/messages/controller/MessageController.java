package net.ahmed.youshar.messages.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.messages.DTO.requestDTO.MessageRequestDTO;
import net.ahmed.youshar.messages.DTO.responseDTO.MessageResponseDTO;
import net.ahmed.youshar.messages.service.IMessageService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@Tag(name = "Messages", description = "Real-time messaging between students")
public class MessageController {

    private final IMessageService messageService;

    @PostMapping("/{senderId}")
    public ResponseEntity<MessageResponseDTO> send(@RequestBody MessageRequestDTO dto,
                                                   @PathVariable Integer senderId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(messageService.send(dto, senderId));
    }

    @GetMapping("/conversation/{userId1}/{userId2}")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(@PathVariable Integer userId1,
                                                                     @PathVariable Integer userId2) {
        return ResponseEntity.ok(messageService.getConversation(userId1, userId2));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MessageResponseDTO>> getConversationsByUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(messageService.getConversationsByUser(userId));
    }

    @GetMapping("/unread/{receiverId}")
    public ResponseEntity<List<MessageResponseDTO>> getUnreadMessages(@PathVariable Integer receiverId) {
        return ResponseEntity.ok(messageService.getUnreadMessages(receiverId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<MessageResponseDTO> markAsRead(@PathVariable Integer id) {
        return ResponseEntity.ok(messageService.markAsRead(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        messageService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Message deleted successfully"));
    }
}
