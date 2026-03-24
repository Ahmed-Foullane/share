package net.ahmed.youshar.post.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.LikeRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.LikeResponseDTO;
import net.ahmed.youshar.post.entity.Like;
import net.ahmed.youshar.post.mapper.LikeMapper;
import net.ahmed.youshar.post.repository.LikeRepository;
import net.ahmed.youshar.post.service.ILikeService;
import net.ahmed.youshar.user.entity.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LikeServiceImpl implements ILikeService {

    private final LikeRepository likeRepository;
    private final LikeMapper likeMapper;

    @Override
    @Transactional
    public LikeResponseDTO toggleLike(LikeRequestDTO dto, Integer studentId) {
        Optional<Like> existing = likeRepository.findByLikeableTypeAndLikeableIdAndStudentId(
                dto.getLikeableType(), dto.getLikeableId(), studentId);

        if (existing.isPresent()) {
            likeRepository.delete(existing.get());
            return null;
        }

        Like like = likeMapper.toEntity(dto);
        Student student = new Student();
        student.setId(studentId);
        like.setStudent(student);
        Like saved = likeRepository.save(like);
        return likeMapper.toResponseDTO(saved);
    }

    @Override
    public List<LikeResponseDTO> getLikesByEntity(String likeableType, Integer likeableId) {
        return likeRepository.findByLikeableTypeAndLikeableId(likeableType, likeableId).stream()
                .map(likeMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public long countLikes(String likeableType, Integer likeableId) {
        return likeRepository.countByLikeableTypeAndLikeableId(likeableType, likeableId);
    }
}
