package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.TagRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.TagResponseDTO;

import java.util.List;

public interface ITagService {
    TagResponseDTO create(TagRequestDTO dto);
    TagResponseDTO getById(Integer id);
    List<TagResponseDTO> getAll();
    TagResponseDTO update(Integer id, TagRequestDTO dto);
    void delete(Integer id);
}
