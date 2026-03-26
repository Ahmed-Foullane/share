package net.ahmed.youshar.friends.mapper;

import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsRequestsResponseDTO;
import net.ahmed.youshar.friends.entity.FriendsRequests;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FriendsRequestsMapper {
    FriendsRequests toEntity(FriendsRequestsRequestDTO requestDTO);
    FriendsRequestsResponseDTO toResponseDTO(FriendsRequests entity);
}
