package net.ahmed.youshar.friends.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsRequestsResponseDTO;
import net.ahmed.youshar.friends.enume.RequestStatus;
import net.ahmed.youshar.friends.service.IFriendsRequestsService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friend-requests")
@RequiredArgsConstructor
@Tag(name = "Friend Requests", description = "Send and manage friend requests")
public class FriendsRequestsController {

    private final IFriendsRequestsService friendsRequestsService;

    @PostMapping
    public ResponseEntity<FriendsRequestsResponseDTO> create(@RequestBody FriendsRequestsRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(friendsRequestsService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FriendsRequestsResponseDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(friendsRequestsService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<FriendsRequestsResponseDTO>> getAll() {
        return ResponseEntity.ok(friendsRequestsService.getAll());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FriendsRequestsResponseDTO>> getByStatus(@PathVariable RequestStatus status) {
        return ResponseEntity.ok(friendsRequestsService.getByStatus(status));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<FriendsRequestsResponseDTO> accept(@PathVariable Integer id) {
        return ResponseEntity.ok(friendsRequestsService.updateStatus(id, RequestStatus.accepted));
    }

    @PatchMapping("/{id}/decline")
    public ResponseEntity<FriendsRequestsResponseDTO> decline(@PathVariable Integer id) {
        return ResponseEntity.ok(friendsRequestsService.updateStatus(id, RequestStatus.declined));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Integer id) {
        friendsRequestsService.delete(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Friend request deleted successfully"));
    }
}
