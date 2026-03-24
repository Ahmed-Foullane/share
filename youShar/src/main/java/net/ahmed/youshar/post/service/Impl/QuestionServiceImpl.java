package net.ahmed.youshar.post.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.QuestionRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.QuestionResponseDTO;
import net.ahmed.youshar.post.entity.Question;
import net.ahmed.youshar.post.exception.ResourceNotFoundException;
import net.ahmed.youshar.post.mapper.QuestionMapper;
import net.ahmed.youshar.post.repository.QuestionRepository;
import net.ahmed.youshar.post.service.IQuestionService;
import net.ahmed.youshar.user.entity.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements IQuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionMapper questionMapper;

    @Override
    @Transactional
    public QuestionResponseDTO create(QuestionRequestDTO dto, Integer authorId) {
        Question question = questionMapper.toEntity(dto);
        Student author = new Student();
        author.setId(authorId);
        question.setAuthor(author);
        question.setDate(LocalDateTime.now());
        question.setVotes(0);
        Question saved = questionRepository.save(question);
        return questionMapper.toResponseDTO(saved);
    }

    @Override
    public QuestionResponseDTO getById(Integer id) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", id));
        return questionMapper.toResponseDTO(question);
    }

    @Override
    public List<QuestionResponseDTO> getAll() {
        return questionRepository.findAll().stream()
                .map(questionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionResponseDTO> getByAuthor(Integer authorId) {
        return questionRepository.findByAuthorId(authorId).stream()
                .map(questionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuestionResponseDTO> search(String title) {
        return questionRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(questionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public QuestionResponseDTO update(Integer id, QuestionRequestDTO dto) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Question", id));
        question.setTitle(dto.getTitle());
        question.setDescription(dto.getDescription());
        Question updated = questionRepository.save(question);
        return questionMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!questionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Question", id);
        }
        questionRepository.deleteById(id);
    }
}
