package net.ahmed.youshar.post.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.CategoryRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CategoryResponseDTO;
import net.ahmed.youshar.post.entity.Category;
import net.ahmed.youshar.post.exception.DuplicateResourceException;
import net.ahmed.youshar.post.exception.ResourceNotFoundException;
import net.ahmed.youshar.post.mapper.CategoryMapper;
import net.ahmed.youshar.post.repository.CategoryRepository;
import net.ahmed.youshar.post.service.ICategoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    @Transactional
    public CategoryResponseDTO create(CategoryRequestDTO dto) {
        categoryRepository.findByNameIgnoreCase(dto.getName())
                .ifPresent(c -> { throw new DuplicateResourceException("Category", "name", dto.getName()); });
        Category category = categoryMapper.toEntity(dto);
        Category saved = categoryRepository.save(category);
        return categoryMapper.toResponseDTO(saved);
    }

    @Override
    public CategoryResponseDTO getById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        return categoryMapper.toResponseDTO(category);
    }

    @Override
    public List<CategoryResponseDTO> getAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponseDTO update(Integer id, CategoryRequestDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", id));
        category.setName(dto.getName());
        Category updated = categoryRepository.save(category);
        return categoryMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category", id);
        }
        categoryRepository.deleteById(id);
    }
}
