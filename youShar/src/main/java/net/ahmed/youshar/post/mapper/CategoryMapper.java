package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.CategoryRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CategoryResponseDTO;
import net.ahmed.youshar.post.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    Category toEntity(CategoryRequestDTO categoryRequestDTO);
    CategoryResponseDTO toResponseDTO(Category category);
}
