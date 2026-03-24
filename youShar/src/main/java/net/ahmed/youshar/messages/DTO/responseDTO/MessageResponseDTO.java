package net.ahmed.youshar.messages.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Integer id;
    private String content;
    private Boolean isRead;
    private Long senderId;
    private Long receiverId;
}
