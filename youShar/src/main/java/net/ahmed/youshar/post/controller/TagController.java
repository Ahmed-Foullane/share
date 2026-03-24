package net.ahmed.youshar.post.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.TagRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.TagResponseDTO;
import net.ahmed.youshar.post.service.ITagService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
@Tag(name = "Tags", description = "Manage tags for articles and questions")
public class TagController {

    private final ITagService tagService;

    @PostMapping
    public ResponseEntity<TagResponseDTO> create(@Valid @RequestBody TagRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tagService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TagResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(tagService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<TagResponseDTO>> getAll() {
        return ResponseEntity.ok(tagService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<TagResponseDTO> update(@PathVariable Integer id,
                                                 @Valid @RequestBody TagRequestDTO dto) {
        return ResponseEntity.ok(tagService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        tagService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Tag deleted successfully"));
    }
}
