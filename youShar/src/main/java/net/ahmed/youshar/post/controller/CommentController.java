package net.ahmed.youshar.post.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.CommentRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.CommentResponseDTO;
import net.ahmed.youshar.post.service.ICommentService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comments", description = "Manage answers/comments on questions")
public class CommentController {

    private final ICommentService commentService;

    @PostMapping("/{authorId}")
    public ResponseEntity<CommentResponseDTO> create(@Valid @RequestBody CommentRequestDTO dto,
                                                     @PathVariable Integer authorId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(dto, authorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.getById(id));
    }

    @GetMapping("/question/{questionId}")
    public ResponseEntity<List<CommentResponseDTO>> getByQuestion(@PathVariable Integer questionId) {
        return ResponseEntity.ok(commentService.getByQuestion(questionId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> update(@PathVariable Integer id,
                                                     @Valid @RequestBody CommentRequestDTO dto) {
        return ResponseEntity.ok(commentService.update(id, dto));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<CommentResponseDTO> acceptAnswer(@PathVariable Integer id) {
        return ResponseEntity.ok(commentService.acceptAnswer(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        commentService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Comment deleted successfully"));
    }
}
