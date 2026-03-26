package net.ahmed.youshar.friends.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.friends.enume.RequestStatus;
import net.ahmed.youshar.friends.enume.RequestType;

@Entity
@Table(name = "friends_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FriendsRequests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    private RequestType type;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

}
