package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.TagRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.TagResponseDTO;
import net.ahmed.youshar.post.entity.Tag;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TagMapper {
    Tag toEntity(TagRequestDTO tagRequestDTO);
    TagResponseDTO toResponseDTO(Tag tag);
}
