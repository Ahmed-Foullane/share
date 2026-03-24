package net.ahmed.youshar.post.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponseDTO {
    private Integer id;
    private String content;
    private Boolean isAccepted;
    private Integer votes;
    private Integer questionId;
    private Long authorId;
}
