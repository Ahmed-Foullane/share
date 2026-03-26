package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.ArticleRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.ArticleResponseDTO;
import net.ahmed.youshar.post.entity.Article;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ArticleMapper {

    @Mapping(source = "categoryId", target = "category.id")
    Article toEntity(ArticleRequestDTO articleRequestDTO);

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "author.id", target = "authorId")
    ArticleResponseDTO toResponseDTO(Article article);
}
