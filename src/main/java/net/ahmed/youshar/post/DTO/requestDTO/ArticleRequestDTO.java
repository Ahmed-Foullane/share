package net.ahmed.youshar.post.DTO.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleRequestDTO {
    private String title;
    private String content;
    private Integer categoryId;
    private Long imageId;
}
