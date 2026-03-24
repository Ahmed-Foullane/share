package net.ahmed.youshar.post.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponseDTO {
    private Integer id;
    private String title;
    private String description;
    private Integer votes;
    private LocalDateTime date;
    private Long authorId;
}
