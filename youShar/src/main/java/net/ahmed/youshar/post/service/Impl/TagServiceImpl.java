package net.ahmed.youshar.post.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.TagRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.TagResponseDTO;
import net.ahmed.youshar.post.entity.Tag;
import net.ahmed.youshar.post.exception.DuplicateResourceException;
import net.ahmed.youshar.post.exception.ResourceNotFoundException;
import net.ahmed.youshar.post.mapper.TagMapper;
import net.ahmed.youshar.post.repository.TagRepository;
import net.ahmed.youshar.post.service.ITagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements ITagService {

    private final TagRepository tagRepository;
    private final TagMapper tagMapper;

    @Override
    @Transactional
    public TagResponseDTO create(TagRequestDTO dto) {
        tagRepository.findByNameIgnoreCase(dto.getName())
                .ifPresent(t -> { throw new DuplicateResourceException("Tag", "name", dto.getName()); });
        Tag tag = tagMapper.toEntity(dto);
        Tag saved = tagRepository.save(tag);
        return tagMapper.toResponseDTO(saved);
    }

    @Override
    public TagResponseDTO getById(Integer id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", id));
        return tagMapper.toResponseDTO(tag);
    }

    @Override
    public List<TagResponseDTO> getAll() {
        return tagRepository.findAll().stream()
                .map(tagMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagResponseDTO update(Integer id, TagRequestDTO dto) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tag", id));
        tag.setName(dto.getName());
        Tag updated = tagRepository.save(tag);
        return tagMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!tagRepository.existsById(id)) {
            throw new ResourceNotFoundException("Tag", id);
        }
        tagRepository.deleteById(id);
    }
}
