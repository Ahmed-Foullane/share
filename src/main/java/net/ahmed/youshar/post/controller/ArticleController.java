package net.ahmed.youshar.post.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.ArticleRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.ArticleResponseDTO;
import net.ahmed.youshar.post.service.IArticleService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@Tag(name = "Articles", description = "Manage technical articles")
public class ArticleController {

    private final IArticleService articleService;

    @PostMapping("/{authorId}")
    public ResponseEntity<ArticleResponseDTO> create(@Valid @RequestBody ArticleRequestDTO dto,
                                                     @PathVariable Integer authorId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.create(dto, authorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(articleService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ArticleResponseDTO>> getAll() {
        return ResponseEntity.ok(articleService.getAll());
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ArticleResponseDTO>> getByCategory(@PathVariable Integer categoryId) {
        return ResponseEntity.ok(articleService.getByCategory(categoryId));
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<ArticleResponseDTO>> getByAuthor(@PathVariable Integer authorId) {
        return ResponseEntity.ok(articleService.getByAuthor(authorId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ArticleResponseDTO>> search(@RequestParam String title) {
        return ResponseEntity.ok(articleService.search(title));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleResponseDTO> update(@PathVariable Integer id,
                                                     @Valid @RequestBody ArticleRequestDTO dto) {
        return ResponseEntity.ok(articleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        articleService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Article deleted successfully"));
    }
}
