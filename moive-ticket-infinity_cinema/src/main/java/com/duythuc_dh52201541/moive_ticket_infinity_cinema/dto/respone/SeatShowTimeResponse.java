package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Seats;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Users;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomType;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatShowTimeStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatShowTimeResponse {
    Long seatShowTimeId;

    String userId;

    Long seatId;
    String seatRow;     // Ví dụ: "A"
    Integer seatNumber; // Ví dụ: 1
    String seatType;    // VIP/NORMAL

    Long showTimeId;
    Long roomId;
    String roomName;
    RoomType roomType;

    LocalDateTime lockedUntil;
    SeatShowTimeStatus seatShowTimeStatus;
}
