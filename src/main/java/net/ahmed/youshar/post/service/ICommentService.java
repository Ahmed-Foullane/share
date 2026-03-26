package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.CommentRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CommentResponseDTO;

import java.util.List;

public interface ICommentService {
    CommentResponseDTO create(CommentRequestDTO dto, Integer authorId);
    CommentResponseDTO getById(Integer id);
    List<CommentResponseDTO> getByQuestion(Integer questionId);
    CommentResponseDTO update(Integer id, CommentRequestDTO dto);
    CommentResponseDTO acceptAnswer(Integer id);
    void delete(Integer id);
}
