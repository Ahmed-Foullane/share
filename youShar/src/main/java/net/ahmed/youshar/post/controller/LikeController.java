package net.ahmed.youshar.post.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.post.DTO.requestDTO.LikeRequestDTO;
import net.ahmed.youshar.post.DTO.responseDTO.LikeResponseDTO;
import net.ahmed.youshar.post.service.ILikeService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Tag(name = "Likes", description = "Like/unlike articles, questions, comments")
public class LikeController {

    private final ILikeService likeService;

    @PostMapping("/{studentId}")
    public ResponseEntity<?> toggleLike(@RequestBody LikeRequestDTO dto,
                                        @PathVariable Integer studentId) {
        LikeResponseDTO result = likeService.toggleLike(dto, studentId);
        if (result == null) {
            return ResponseEntity.ok(new ResponseMessage(200, "Like removed"));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{likeableType}/{likeableId}")
    public ResponseEntity<List<LikeResponseDTO>> getLikes(@PathVariable String likeableType,
                                                          @PathVariable Integer likeableId) {
        return ResponseEntity.ok(likeService.getLikesByEntity(likeableType, likeableId));
    }

    @GetMapping("/{likeableType}/{likeableId}/count")
    public ResponseEntity<Long> countLikes(@PathVariable String likeableType,
                                           @PathVariable Integer likeableId) {
        return ResponseEntity.ok(likeService.countLikes(likeableType, likeableId));
    }
}
