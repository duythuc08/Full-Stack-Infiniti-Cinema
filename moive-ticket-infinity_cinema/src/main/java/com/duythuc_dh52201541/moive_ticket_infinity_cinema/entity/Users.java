package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name="users")
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String userId;

    @Column(unique = true)
    String username; //su dung email
    String password;
    String firstname;
    String lastname;
    String phoneNumber;
    LocalDate birthday;

    @OneToMany(mappedBy = "users")
    Set<UserPromotion> userPromotions;

    @ManyToMany
    Set<Role> role;

    @Enumerated(EnumType.STRING)
    UserStatus userStatus;

    boolean enabled = false; //verify email
    LocalDateTime createdAt = LocalDateTime.now(); //thời gian khơ tạo

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    @Column(name = "loyalty_points")
    int loyaltyPoints = 0; // Tổng điểm khả dụng hiện tại

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tier_id")
    MembershipTier membershipTier; // Hạng thành viên hiện tại
}

