package net.ahmed.youshar.friends.service;

import net.ahmed.youshar.friends.DTO.requestDTO.SearchRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.SearchResponseDTO;

import java.util.List;

public interface ISearchService {
    SearchResponseDTO save(SearchRequestDTO dto);
    List<SearchResponseDTO> getAll();
    List<SearchResponseDTO> search(String text);
    void delete(Long id);
    void deleteAll();
}
