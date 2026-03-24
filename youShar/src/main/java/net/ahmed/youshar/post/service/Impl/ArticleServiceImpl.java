package net.ahmed.youshar.post.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.ArticleRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.ArticleResponseDTO;
import net.ahmed.youshar.post.entity.Article;
import net.ahmed.youshar.post.entity.Category;
import net.ahmed.youshar.post.exception.ResourceNotFoundException;
import net.ahmed.youshar.post.mapper.ArticleMapper;
import net.ahmed.youshar.post.repository.ArticleRepository;
import net.ahmed.youshar.post.repository.CategoryRepository;
import net.ahmed.youshar.post.service.IArticleService;
import net.ahmed.youshar.user.entity.Student;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements IArticleService {

    private final ArticleRepository articleRepository;
    private final CategoryRepository categoryRepository;
    private final ArticleMapper articleMapper;

    @Override
    @Transactional
    public ArticleResponseDTO create(ArticleRequestDTO dto, Integer authorId) {
        Article article = articleMapper.toEntity(dto);

        if (dto.getCategoryId() == null) {
            throw new IllegalArgumentException("categoryId must not be null");
        }
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", dto.getCategoryId()));
        article.setCategory(category);

        Student author = new Student();
        author.setId(authorId);
        article.setAuthor(author);
        article.setDate(LocalDateTime.now());
        article.setLikes(0);
        Article saved = articleRepository.save(article);
        return articleMapper.toResponseDTO(saved);
    }

    @Override
    public ArticleResponseDTO getById(Integer id) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article", id));
        return articleMapper.toResponseDTO(article);
    }

    @Override
    public List<ArticleResponseDTO> getAll() {
        return articleRepository.findAll().stream()
                .map(articleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDTO> getByCategory(Integer categoryId) {
        return articleRepository.findByCategoryId(categoryId).stream()
                .map(articleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDTO> getByAuthor(Integer authorId) {
        return articleRepository.findByAuthorId(authorId).stream()
                .map(articleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ArticleResponseDTO> search(String title) {
        return articleRepository.findByTitleContainingIgnoreCase(title).stream()
                .map(articleMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ArticleResponseDTO update(Integer id, ArticleRequestDTO dto) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Article", id));
        article.setTitle(dto.getTitle());
        article.setContent(dto.getContent());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", dto.getCategoryId()));
            article.setCategory(category);
        }
        Article updated = articleRepository.save(article);
        return articleMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!articleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Article", id);
        }
        articleRepository.deleteById(id);
    }
}
