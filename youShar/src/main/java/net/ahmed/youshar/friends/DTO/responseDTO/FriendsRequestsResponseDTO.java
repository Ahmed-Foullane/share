package net.ahmed.youshar.friends.DTO.responseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.ahmed.youshar.friends.enume.RequestStatus;
import net.ahmed.youshar.friends.enume.RequestType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendsRequestsResponseDTO {
    private Integer id;
    private RequestType type;
    private RequestStatus status;
}
