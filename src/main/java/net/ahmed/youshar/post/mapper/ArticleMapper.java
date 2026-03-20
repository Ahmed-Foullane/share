package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.ArticleRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.ArticleResponseDTO;
import net.ahmed.youshar.post.entity.Article;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ArticleMapper {

    @Mapping(source = "categoryId", target = "category.id")
    @Mapping(source = "imageId", target = "image.id")
    Article toEntity(ArticleRequestDTO articleRequestDTO);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "image.id", target = "imageId")
    @Mapping(source = "author.id", target = "authorId")
    ArticleResponseDTO toResponseDTO(Article article);
}
