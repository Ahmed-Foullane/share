package net.ahmed.youshar.post.DTO.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequestDTO {
    private String title;
    private String description;
    private Long imageId;
}
