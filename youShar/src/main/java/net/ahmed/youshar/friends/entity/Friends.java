package net.ahmed.youshar.friends.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.user.entity.AppUser;

@Entity
@Table(name = "friends")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Friends {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private AppUser friend;
}
