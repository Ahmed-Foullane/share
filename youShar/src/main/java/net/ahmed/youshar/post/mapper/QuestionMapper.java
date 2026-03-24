package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.QuestionRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.QuestionResponseDTO;
import net.ahmed.youshar.post.entity.Question;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface QuestionMapper {

    Question toEntity(QuestionRequestDTO questionRequestDTO);

    @Mapping(source = "author.id", target = "authorId")
    QuestionResponseDTO toResponseDTO(Question question);
}
