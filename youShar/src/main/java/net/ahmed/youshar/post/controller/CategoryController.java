package net.ahmed.youshar.post.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.CategoryRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CategoryResponseDTO;
import net.ahmed.youshar.post.service.ICategoryService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Manage article categories")
public class CategoryController {

    private final ICategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponseDTO> create(@Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(categoryService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok(categoryService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> update(@PathVariable Integer id,
                                                      @Valid @RequestBody CategoryRequestDTO dto) {
        return ResponseEntity.ok(categoryService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        categoryService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Category deleted successfully"));
    }
}
