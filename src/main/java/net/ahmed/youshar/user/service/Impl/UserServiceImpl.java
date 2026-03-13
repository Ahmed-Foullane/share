package net.ahmed.youshar.user.service.Impl;

import net.ahmed.youshar.user.DTO.UserDTO;
import net.ahmed.youshar.user.entity.AppUser;
import net.ahmed.youshar.user.entity.enume.Role;
import net.ahmed.youshar.user.service.IUserService;

import java.util.List;

public class UserServiceImpl implements IUserService {

    @Override
    public AppUser createUser(Role role, UserDTO dto) {
        return null;
    }

    @Override
    public AppUser updateRole(Role role, Long id) {
        return null;
    }

    @Override
    public List<AppUser> getAllUsers() {
        return List.of();
    }

    @Override
    public AppUser searchUserByEmail(String email) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }
}
