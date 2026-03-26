package net.ahmed.youshar.friends.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendsResponseDTO {
    private Integer id;
    private Long userId;
    private Long friendId;
}
