package net.ahmed.youshar.friends.mapper;

import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsResponseDTO;
import net.ahmed.youshar.friends.entity.Friends;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface FriendsMapper {

    @Mapping(source = "friendId", target = "friend.id")
    Friends toEntity(FriendsRequestDTO friendsRequestDTO);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "friend.id", target = "friendId")
    FriendsResponseDTO toResponseDTO(Friends friends);
}
