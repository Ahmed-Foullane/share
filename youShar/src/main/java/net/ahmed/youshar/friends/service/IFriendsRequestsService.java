package net.ahmed.youshar.friends.service;

import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsRequestsResponseDTO;
import net.ahmed.youshar.friends.enume.RequestStatus;

import java.util.List;

public interface IFriendsRequestsService {
    FriendsRequestsResponseDTO create(FriendsRequestsRequestDTO dto);
    FriendsRequestsResponseDTO getById(Integer id);
    List<FriendsRequestsResponseDTO> getAll();
    List<FriendsRequestsResponseDTO> getByStatus(RequestStatus status);
    FriendsRequestsResponseDTO updateStatus(Integer id, RequestStatus status);
    void delete(Integer id);
}
