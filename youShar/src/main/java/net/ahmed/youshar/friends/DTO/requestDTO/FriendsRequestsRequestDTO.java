package net.ahmed.youshar.friends.DTO.requestDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import net.ahmed.youshar.friends.enume.RequestType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendsRequestsRequestDTO {
    private RequestType type;
}
