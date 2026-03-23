package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatShowTimeStatus;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SeatShowTimeRequest {
    LocalDateTime lockedUntil;
    String userId;
    Long seatId;
    Long showTimeId;
    SeatShowTimeStatus seatShowTimeStatus;
}
