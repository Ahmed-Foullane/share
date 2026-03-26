package net.ahmed.youshar.friends.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.friends.DTO.requestDTO.SearchRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.SearchResponseDTO;
import net.ahmed.youshar.friends.entity.Search;
import net.ahmed.youshar.friends.mapper.SearchMapper;
import net.ahmed.youshar.friends.repository.SearchRepository;
import net.ahmed.youshar.friends.service.ISearchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SearchServiceImpl implements ISearchService {

    private final SearchRepository searchRepository;
    private final SearchMapper searchMapper;

    @Override
    @Transactional
    public SearchResponseDTO save(SearchRequestDTO dto) {
        Search search = searchMapper.toEntity(dto);
        Search saved = searchRepository.save(search);
        return searchMapper.toResponseDTO(saved);
    }

    @Override
    public List<SearchResponseDTO> getAll() {
        return searchRepository.findAll().stream()
                .map(searchMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SearchResponseDTO> search(String text) {
        return searchRepository.findByTextContainingIgnoreCase(text).stream()
                .map(searchMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void delete(Long id) {
        searchRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteAll() {
        searchRepository.deleteAll();
    }
}
