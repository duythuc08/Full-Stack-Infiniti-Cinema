package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class RoomRequest {
    String name;
    Integer capacity; // Sức chứa tối đa của phòng.

    @ManyToOne
    @JoinColumn(name = "cinema_id")
    Cinemas cinemas;

    @Enumerated(EnumType.STRING)
    RoomType roomType; // Loại phòng (ví dụ: STANDARD, VIP, IMAX).

    @Enumerated(EnumType.STRING)
    RoomStatus roomStatus; // Trạng thái hiện tại của phòng (ví dụ: AVAILABLE, MAINTENANCE).
}
