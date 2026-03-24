package net.ahmed.youshar.friends.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsResponseDTO;
import net.ahmed.youshar.friends.service.IFriendsService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
@Tag(name = "Friends", description = "Manage friendships")
public class FriendsController {

    private final IFriendsService friendsService;

    @PostMapping("/{userId}")
    public ResponseEntity<FriendsResponseDTO> addFriend(@RequestBody FriendsRequestDTO dto,
                                                        @PathVariable Long userId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(friendsService.addFriend(dto, userId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FriendsResponseDTO>> getFriendsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(friendsService.getFriendsByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> removeFriend(@PathVariable Integer id) {
        friendsService.removeFriend(id);
        return ResponseEntity.ok(new ResponseMessage(200, "Friend removed successfully"));
    }
}
