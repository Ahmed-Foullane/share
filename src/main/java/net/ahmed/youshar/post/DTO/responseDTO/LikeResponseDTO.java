package net.ahmed.youshar.post.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeResponseDTO {
    private Integer id;
    private String likeableType;
    private Integer likeableId;
    private Long studentId;
}
