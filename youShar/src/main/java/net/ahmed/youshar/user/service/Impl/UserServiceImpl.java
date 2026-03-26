package net.ahmed.youshar.user.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.auth.exception.UserNotFoundException;
import net.ahmed.youshar.user.DTO.UserDTO;
import net.ahmed.youshar.user.entity.AppUser;
import net.ahmed.youshar.user.entity.enume.Role;
import net.ahmed.youshar.user.mapper.UserMapper;
import net.ahmed.youshar.user.repository.UserRepository;
import net.ahmed.youshar.user.service.IUserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public AppUser createUser(Role role, UserDTO dto) {
        AppUser user = userMapper.toEntity(dto);
        user.setRole(role);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public AppUser updateRole(Role role, Long id) {
        AppUser user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User with id " + id + " not found"));
        user.setRole(role);
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    @Override
    public List<AppUser> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public AppUser searchUserByEmail(String email) {
        return userRepository.findUserByEmailContainingIgnoreCase(email)
                .orElseThrow(() -> new UserNotFoundException("User with email " + email + " not found"));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User with id " + id + " not found");
        }
        userRepository.deleteById(id);
    }
}
