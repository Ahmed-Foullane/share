package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.QuestionRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.QuestionResponseDTO;

import java.util.List;

public interface IQuestionService {
    QuestionResponseDTO create(QuestionRequestDTO dto, Integer authorId);
    QuestionResponseDTO getById(Integer id);
    List<QuestionResponseDTO> getAll();
    List<QuestionResponseDTO> getByAuthor(Integer authorId);
    List<QuestionResponseDTO> search(String title);
    QuestionResponseDTO update(Integer id, QuestionRequestDTO dto);
    void delete(Integer id);
}
