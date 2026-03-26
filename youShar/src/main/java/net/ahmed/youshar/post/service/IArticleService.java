package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.ArticleRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.ArticleResponseDTO;

import java.util.List;

public interface IArticleService {
    ArticleResponseDTO create(ArticleRequestDTO dto, Integer authorId);
    ArticleResponseDTO getById(Integer id);
    List<ArticleResponseDTO> getAll();
    List<ArticleResponseDTO> getByCategory(Integer categoryId);
    List<ArticleResponseDTO> getByAuthor(Integer authorId);
    List<ArticleResponseDTO> search(String title);
    ArticleResponseDTO update(Integer id, ArticleRequestDTO dto);
    void delete(Integer id);
}
