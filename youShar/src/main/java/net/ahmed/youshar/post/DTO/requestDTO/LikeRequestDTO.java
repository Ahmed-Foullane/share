package net.ahmed.youshar.post.DTO.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeRequestDTO {
    private String likeableType;
    private Integer likeableId;
}
