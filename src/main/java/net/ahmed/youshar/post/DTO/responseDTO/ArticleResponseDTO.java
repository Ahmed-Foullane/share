package net.ahmed.youshar.post.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleResponseDTO {
    private Integer id;
    private String title;
    private String content;
    private Integer categoryId;
    private Integer likes;
    private Long imageId;
    private LocalDateTime date;
    private Long authorId;
}
