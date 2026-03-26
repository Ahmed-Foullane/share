package net.ahmed.youshar.user.service;

import net.ahmed.youshar.user.DTO.UserDTO;
import net.ahmed.youshar.user.entity.AppUser;
import net.ahmed.youshar.user.entity.enume.Role;

import java.util.List;

public interface IUserService {
    AppUser createUser(Role role, UserDTO dto);
    AppUser updateRole(Role role, Long id);
    List<AppUser> getAllUsers();
    AppUser searchUserByEmail(String email);
    void deleteUser(Long id);

}
