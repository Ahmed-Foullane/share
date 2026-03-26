package net.ahmed.youshar.user.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.user.DTO.UserDTO;
import net.ahmed.youshar.user.entity.AppUser;
import net.ahmed.youshar.user.entity.Student;
import net.ahmed.youshar.user.entity.enume.Role;
import net.ahmed.youshar.user.repository.StudentRepository;
import net.ahmed.youshar.user.service.IUserService;
import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Manage users")
public class userController {

    private final IUserService userService;
    private final StudentRepository studentRepository;

    @PostMapping("/{role}")
    public ResponseEntity<AppUser> create(@PathVariable Role role, @RequestBody UserDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(role, dto));
    }

    @GetMapping
    public ResponseEntity<List<AppUser>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/search")
    public ResponseEntity<AppUser> searchByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.searchUserByEmail(email));
    }

    @PatchMapping("/{id}/role/{role}")
    public ResponseEntity<AppUser> updateRole(@PathVariable Long id, @PathVariable Role role) {
        return ResponseEntity.ok(userService.updateRole(role, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseMessage> delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ResponseMessage(200, "User deleted successfully"));
    }

    @GetMapping("/{userId}/student")
    public ResponseEntity<?> getStudentByUserId(@PathVariable Long userId) {
        return studentRepository.findByUserId(userId)
                .map(student -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("studentId", student.getId());
                    result.put("userId", userId);
                    return ResponseEntity.ok(result);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
