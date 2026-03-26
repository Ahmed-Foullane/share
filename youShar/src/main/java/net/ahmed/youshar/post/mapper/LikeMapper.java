package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.LikeRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.LikeResponseDTO;
import net.ahmed.youshar.post.entity.Like;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LikeMapper {

    Like toEntity(LikeRequestDTO likeRequestDTO);

    @Mapping(source = "student.id", target = "studentId")
    LikeResponseDTO toResponseDTO(Like like);
}
