package net.ahmed.youshar.friends.service.Impl;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.friends.DTO.requestDTO.FriendsRequestDTO;
import net.ahmed.youshar.friends.DTO.responseDTO.FriendsResponseDTO;
import net.ahmed.youshar.friends.entity.Friends;
import net.ahmed.youshar.friends.exception.FriendshipAlreadyExistsException;
import net.ahmed.youshar.friends.exception.FriendshipNotFoundException;
import net.ahmed.youshar.friends.mapper.FriendsMapper;
import net.ahmed.youshar.friends.repository.FriendsRepository;
import net.ahmed.youshar.friends.service.IFriendsService;
import net.ahmed.youshar.user.entity.AppUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendsServiceImpl implements IFriendsService {

    private final FriendsRepository friendsRepository;
    private final FriendsMapper friendsMapper;

    @Override
    @Transactional
    public FriendsResponseDTO addFriend(FriendsRequestDTO dto, Long userId) {
        if (friendsRepository.existsByUserIdAndFriendId(userId, dto.getFriendId())) {
            throw new FriendshipAlreadyExistsException(userId, dto.getFriendId());
        }

        Friends friends = friendsMapper.toEntity(dto);
        AppUser user = new AppUser();
        user.setId(userId);
        friends.setUser(user);
        Friends saved = friendsRepository.save(friends);
        return friendsMapper.toResponseDTO(saved);
    }

    @Override
    public List<FriendsResponseDTO> getFriendsByUser(Long userId) {
        return friendsRepository.findByUserId(userId).stream()
                .map(friendsMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void removeFriend(Integer id) {
        if (!friendsRepository.existsById(id)) {
            throw new FriendshipNotFoundException(id);
        }
        friendsRepository.deleteById(id);
    }
}
