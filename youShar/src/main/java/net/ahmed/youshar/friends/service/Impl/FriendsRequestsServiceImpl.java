package net.ahmed.youshar.friends.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsRequestsResponseDTO;
import net.ahmed.youshar.friends.entity.FriendsRequests;
import net.ahmed.youshar.friends.enume.RequestStatus;
import net.ahmed.youshar.friends.exception.FriendRequestNotFoundException;
import net.ahmed.youshar.friends.mapper.FriendsRequestsMapper;
import net.ahmed.youshar.friends.repository.FriendsRequestsRepository;
import net.ahmed.youshar.friends.service.IFriendsRequestsService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendsRequestsServiceImpl implements IFriendsRequestsService {

    private final FriendsRequestsRepository friendsRequestsRepository;
    private final FriendsRequestsMapper friendsRequestsMapper;

    @Override
    @Transactional
    public FriendsRequestsResponseDTO create(FriendsRequestsRequestDTO dto) {
        FriendsRequests request = friendsRequestsMapper.toEntity(dto);
        request.setStatus(RequestStatus.pending);
        FriendsRequests saved = friendsRequestsRepository.save(request);
        return friendsRequestsMapper.toResponseDTO(saved);
    }

    @Override
    public FriendsRequestsResponseDTO getById(Integer id) {
        FriendsRequests request = friendsRequestsRepository.findById(id)
                .orElseThrow(() -> new FriendRequestNotFoundException(id));
        return friendsRequestsMapper.toResponseDTO(request);
    }

    @Override
    public List<FriendsRequestsResponseDTO> getAll() {
        return friendsRequestsRepository.findAll().stream()
                .map(friendsRequestsMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<FriendsRequestsResponseDTO> getByStatus(RequestStatus status) {
        return friendsRequestsRepository.findByStatus(status).stream()
                .map(friendsRequestsMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public FriendsRequestsResponseDTO updateStatus(Integer id, RequestStatus status) {
        FriendsRequests request = friendsRequestsRepository.findById(id)
                .orElseThrow(() -> new FriendRequestNotFoundException(id));
        request.setStatus(status);
        FriendsRequests updated = friendsRequestsRepository.save(request);
        return friendsRequestsMapper.toResponseDTO(updated);
    }

    @Override
    @Transactional
    public void delete(Integer id) {
        if (!friendsRequestsRepository.existsById(id)) {
            throw new FriendRequestNotFoundException(id);
        }
        friendsRequestsRepository.deleteById(id);
    }
}
