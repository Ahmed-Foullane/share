package net.ahmed.youshar.post.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.CommentRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CommentResponseDTO;
import net.ahmed.youshar.post.entity.Comment;
import net.ahmed.youshar.post.exception.ResourceNotFoundException;
import net.ahmed.youshar.post.mapper.CommentMapper;
import net.ahmed.youshar.post.repository.CommentRepository;
import net.ahmed.youshar.post.service.ICommentService;
import net.ahmed.youshar.user.entity.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements ICommentService {

    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    @Override
    @Transactional
    public CommentResponseDTO create(CommentRequestDTO dto, Integer authorId) {
        Comment comment = commentMapper.toEntity(dto);
        Student author = new Student();
        author.setId(authorId);
        comment.setAuthor(author);
        comment.setIsAccepted(false);
        comment.setVotes(0);
        Comment saved = commentRepository.save(comment);
        return commentMapper.toResponseDTO(saved);
    }

    @Override
    public CommentResponseDTO getById(Integer id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        return commentMapper.toResponseDTO(comment);
    }

    @Override
    public List<CommentResponseDTO> getByQuestion(Integer questionId) {
        return commentRepository.findByQuestionId(questionId).stream()
                .map(commentMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentResponseDTO update(Integer id, CommentRequestDTO dto) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        comment.setContent(dto.getContent());
        Comment updated = commentRepository.save(comment);
        return commentMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public CommentResponseDTO acceptAnswer(Integer id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment", id));
        comment.setIsAccepted(true);
        Comment updated = commentRepository.save(comment);
        return commentMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!commentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Comment", id);
        }
        commentRepository.deleteById(id);
    }
}
