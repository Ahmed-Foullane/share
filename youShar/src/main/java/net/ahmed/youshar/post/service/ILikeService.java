package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.LikeRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.LikeResponseDTO;

import java.util.List;

public interface ILikeService {
    LikeResponseDTO toggleLike(LikeRequestDTO dto, Integer studentId);
    List<LikeResponseDTO> getLikesByEntity(String likeableType, Integer likeableId);
    long countLikes(String likeableType, Integer likeableId);
}
