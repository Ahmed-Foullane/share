package net.ahmed.youshar.friends.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.friends.DTO.requestDTO.SearchRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.SearchResponseDTO;
import net.ahmed.youshar.friends.service.ISearchService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Search history management")
public class SearchController {

    private final ISearchService searchService;

    @PostMapping
    public ResponseEntity<SearchResponseDTO> save(@RequestBody SearchRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(searchService.save(dto));
    }

    @GetMapping
    public ResponseEntity<List<SearchResponseDTO>> getAll() {
        return ResponseEntity.ok(searchService.getAll());
    }

    @GetMapping("/query")
    public ResponseEntity<List<SearchResponseDTO>> search(@RequestParam String text) {
        return ResponseEntity.ok(searchService.search(text));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Long id) {
        searchService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Search entry deleted successfully"));
    }

    @DeleteMapping
    public ResponseEntity<ResponseMessage> deleteAll() {
        searchService.deleteAll();
        return ResponseEntity.ok(new ResponseMessage(200, "Search history cleared successfully"));
    }
}
