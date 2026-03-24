package net.ahmed.youshar.friends.service;

import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsResponseDTO;

import java.util.List;

public interface IFriendsService {
    FriendsResponseDTO addFriend(FriendsRequestDTO dto, Long userId);
    List<FriendsResponseDTO> getFriendsByUser(Long userId);
    void removeFriend(Integer id);
}
