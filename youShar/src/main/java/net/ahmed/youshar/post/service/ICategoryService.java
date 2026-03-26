package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.CategoryRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CategoryResponseDTO;

import java.util.List;

public interface ICategoryService {
    CategoryResponseDTO create(CategoryRequestDTO dto);
    CategoryResponseDTO getById(Integer id);
    List<CategoryResponseDTO> getAll();
    CategoryResponseDTO update(Integer id, CategoryRequestDTO dto);
    void delete(Integer id);
}
