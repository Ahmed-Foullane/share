package net.ahmed.youshar.post.mapper;

import net.ahmed.youshar.post.DTO.requestDTO.CommentRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CommentResponseDTO;
import net.ahmed.youshar.post.entity.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {

    @Mapping(source = "questionId", target = "question.id")
    Comment toEntity(CommentRequestDTO commentRequestDTO);

    @Mapping(source = "question.id", target = "questionId")
    @Mapping(source = "author.id", target = "authorId")
    CommentResponseDTO toResponseDTO(Comment comment);
}
