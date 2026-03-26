package net.ahmed.youshar.user.mapper;

import net.ahmed.youshar.user.DTO.UserDTO;
import net.ahmed.youshar.user.entity.AppUser;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    AppUser toEntity(UserDTO userDTO);
    UserDTO toDTO(AppUser appUser);
}
