package net.ahmed.youshar.post.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.QuestionRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.QuestionResponseDTO;
import net.ahmed.youshar.post.service.IQuestionService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Questions", description = "Q&A system - manage questions")
public class QuestionController {

    private final IQuestionService questionService;

    @PostMapping("/{authorId}")
    public ResponseEntity<QuestionResponseDTO> create(@Valid @RequestBody QuestionRequestDTO dto,
                                                      @PathVariable Integer authorId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(questionService.create(dto, authorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(questionService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<QuestionResponseDTO>> getAll() {
        return ResponseEntity.ok(questionService.getAll());
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<List<QuestionResponseDTO>> getByAuthor(@PathVariable Integer authorId) {
        return ResponseEntity.ok(questionService.getByAuthor(authorId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<QuestionResponseDTO>> search(@RequestParam String title) {
        return ResponseEntity.ok(questionService.search(title));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuestionResponseDTO> update(@PathVariable Integer id,
                                                      @Valid @RequestBody QuestionRequestDTO dto) {
        return ResponseEntity.ok(questionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        questionService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Question deleted successfully"));
    }
}
