package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.CinemaStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name="cinema")
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class Cinemas {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long cinemaId;

    String name;
    String address;
    @Column(unique = true)
    String phoneNumber;
    @Column(unique = true)
    String email;

    @Enumerated(EnumType.STRING)
    CinemaStatus cinemaStatus;

}
