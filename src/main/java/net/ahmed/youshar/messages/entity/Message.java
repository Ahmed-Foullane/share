package net.ahmed.youshar.messages.entity;

import jakarta.persistence.*;
import lombok.*;
import net.ahmed.youshar.user.entity.Student;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String content;

    private Boolean isRead;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private Student sender;

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private Student receiver;
}
