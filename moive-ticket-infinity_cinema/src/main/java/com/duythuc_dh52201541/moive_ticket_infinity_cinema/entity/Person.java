package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Entity
@Table(name="persons")
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String avatarUrl;   // ảnh đại diện

    @Enumerated(EnumType.STRING)
    @Column(name = "movie_role")
    private MovieRole movieRole;
}
