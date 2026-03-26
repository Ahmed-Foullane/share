package net.ahmed.youshar.post.service;

import net.ahmed.youshar.post.DTO.requestDTO.ArticleRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.ArticleResponseDTO;
import net.ahmed.youshar.post.entity.Article;
import net.ahmed.youshar.post.entity.Category;
import net.ahmed.youshar.post.exception.ResourceNotFoundException;
import net.ahmed.youshar.post.mapper.ArticleMapper;
import net.ahmed.youshar.post.repository.ArticleRepository;
import net.ahmed.youshar.post.repository.CategoryRepository;
import net.ahmed.youshar.post.service.Impl.ArticleServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ArticleServiceImplTest {

    @Mock
    private ArticleRepository articleRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ArticleMapper articleMapper;

    @InjectMocks
    private ArticleServiceImpl articleService;

    private Category category;
    private ArticleRequestDTO requestDto;

    @BeforeEach
    void setUp() {
        category = new Category(1, "Backend");
        requestDto = new ArticleRequestDTO("Spring tips", "Content here", 1);
    }

    @Test
    void create_persistsArticleWithAuthorCategoryAndZeroLikes() {
        Article mapped = new Article();
        mapped.setTitle(requestDto.getTitle());
        mapped.setContent(requestDto.getContent());

        when(articleMapper.toEntity(requestDto)).thenReturn(mapped);
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(articleRepository.save(any(Article.class))).thenAnswer(invocation -> {
            Article a = invocation.getArgument(0);
            a.setId(42);
            return a;
        });

        LocalDateTime before = LocalDateTime.now().minusSeconds(1);
        ArticleResponseDTO response = new ArticleResponseDTO(
                42, "Spring tips", "Content here", 1, 0, LocalDateTime.now(), 7L);
        when(articleMapper.toResponseDTO(any(Article.class))).thenReturn(response);

        ArticleResponseDTO result = articleService.create(requestDto, 7);

        assertThat(result.getId()).isEqualTo(42);
        assertThat(result.getAuthorId()).isEqualTo(7L);

        ArgumentCaptor<Article> captor = ArgumentCaptor.forClass(Article.class);
        verify(articleRepository).save(captor.capture());
        Article saved = captor.getValue();
        assertThat(saved.getCategory()).isEqualTo(category);
        assertThat(saved.getAuthor().getId()).isEqualTo(7);
        assertThat(saved.getLikes()).isZero();
        assertThat(saved.getDate()).isAfter(before);
    }

    @Test
    void create_throwsWhenCategoryIdIsNull() {
        ArticleRequestDTO dto = new ArticleRequestDTO("t", "c", null);
        Article mapped = new Article();
        when(articleMapper.toEntity(dto)).thenReturn(mapped);

        assertThatThrownBy(() -> articleService.create(dto, 1))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("categoryId");

        verify(articleRepository, never()).save(any());
    }

    @Test
    void create_throwsWhenCategoryDoesNotExist() {
        Article mapped = new Article();
        when(articleMapper.toEntity(requestDto)).thenReturn(mapped);
        when(categoryRepository.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articleService.create(requestDto, 1))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category");

        verify(articleRepository, never()).save(any());
    }

    @Test
    void getById_returnsMappedArticle() {
        Article article = new Article();
        article.setId(5);
        when(articleRepository.findById(5)).thenReturn(Optional.of(article));
        ArticleResponseDTO dto = new ArticleResponseDTO(5, "A", "B", 1, 3, null, 2L);
        when(articleMapper.toResponseDTO(article)).thenReturn(dto);

        assertThat(articleService.getById(5)).isEqualTo(dto);
    }

    @Test
    void getById_throwsWhenMissing() {
        when(articleRepository.findById(99)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articleService.getById(99))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article");
    }

    @Test
    void getAll_returnsAllMapped() {
        Article a1 = new Article();
        a1.setId(1);
        Article a2 = new Article();
        a2.setId(2);
        when(articleRepository.findAll()).thenReturn(List.of(a1, a2));
        ArticleResponseDTO d1 = new ArticleResponseDTO(1, "x", "y", 1, 0, null, 1L);
        ArticleResponseDTO d2 = new ArticleResponseDTO(2, "p", "q", 1, 0, null, 1L);
        when(articleMapper.toResponseDTO(a1)).thenReturn(d1);
        when(articleMapper.toResponseDTO(a2)).thenReturn(d2);

        assertThat(articleService.getAll()).containsExactly(d1, d2);
    }

    @Test
    void getByCategory_mapsRepositoryResults() {
        Article article = new Article();
        when(articleRepository.findByCategoryId(3)).thenReturn(List.of(article));
        ArticleResponseDTO dto = new ArticleResponseDTO(1, "t", "c", 3, 0, null, 1L);
        when(articleMapper.toResponseDTO(article)).thenReturn(dto);

        assertThat(articleService.getByCategory(3)).containsExactly(dto);
    }

    @Test
    void getByAuthor_mapsRepositoryResults() {
        Article article = new Article();
        when(articleRepository.findByAuthorId(8)).thenReturn(List.of(article));
        ArticleResponseDTO dto = new ArticleResponseDTO(1, "t", "c", 1, 0, null, 8L);
        when(articleMapper.toResponseDTO(article)).thenReturn(dto);

        assertThat(articleService.getByAuthor(8)).containsExactly(dto);
    }

    @Test
    void search_mapsMatchingTitles() {
        Article article = new Article();
        when(articleRepository.findByTitleContainingIgnoreCase("boot")).thenReturn(List.of(article));
        ArticleResponseDTO dto = new ArticleResponseDTO(1, "Spring Boot", "c", 1, 0, null, 1L);
        when(articleMapper.toResponseDTO(article)).thenReturn(dto);

        assertThat(articleService.search("boot")).containsExactly(dto);
    }

    @Test
    void update_changesFieldsAndOptionallyCategory() {
        Article existing = new Article();
        existing.setId(10);
        existing.setTitle("Old");
        existing.setContent("Old body");
        existing.setCategory(new Category(2, "Other"));

        when(articleRepository.findById(10)).thenReturn(Optional.of(existing));
        when(categoryRepository.findById(1)).thenReturn(Optional.of(category));
        when(articleRepository.save(existing)).thenReturn(existing);

        ArticleRequestDTO update = new ArticleRequestDTO("New title", "New body", 1);
        ArticleResponseDTO response = new ArticleResponseDTO(10, "New title", "New body", 1, 0, null, 1L);
        when(articleMapper.toResponseDTO(existing)).thenReturn(response);

        assertThat(articleService.update(10, update)).isEqualTo(response);
        assertThat(existing.getTitle()).isEqualTo("New title");
        assertThat(existing.getContent()).isEqualTo("New body");
        assertThat(existing.getCategory()).isEqualTo(category);
    }

    @Test
    void update_keepsCategoryWhenCategoryIdNull() {
        Article existing = new Article();
        existing.setId(10);
        Category kept = new Category(2, "Keep");
        existing.setCategory(kept);

        when(articleRepository.findById(10)).thenReturn(Optional.of(existing));
        ArticleRequestDTO update = new ArticleRequestDTO("T", "C", null);
        when(articleRepository.save(existing)).thenReturn(existing);
        when(articleMapper.toResponseDTO(existing)).thenReturn(
                new ArticleResponseDTO(10, "T", "C", 2, 0, null, 1L));

        articleService.update(10, update);

        verify(categoryRepository, never()).findById(any());
        assertThat(existing.getCategory()).isEqualTo(kept);
    }

    @Test
    void update_throwsWhenArticleMissing() {
        when(articleRepository.findById(1)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> articleService.update(1, requestDto))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article");
    }

    @Test
    void update_throwsWhenNewCategoryMissing() {
        Article existing = new Article();
        existing.setId(1);
        when(articleRepository.findById(1)).thenReturn(Optional.of(existing));
        when(categoryRepository.findById(99)).thenReturn(Optional.empty());

        ArticleRequestDTO update = new ArticleRequestDTO("T", "C", 99);

        assertThatThrownBy(() -> articleService.update(1, update))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Category");
    }

    @Test
    void delete_removesWhenExists() {
        when(articleRepository.existsById(5)).thenReturn(true);

        articleService.delete(5);

        verify(articleRepository).deleteById(5);
    }

    @Test
    void delete_throwsWhenMissing() {
        when(articleRepository.existsById(5)).thenReturn(false);

        assertThatThrownBy(() -> articleService.delete(5))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Article");

        verify(articleRepository, never()).deleteById(any());
    }
}
