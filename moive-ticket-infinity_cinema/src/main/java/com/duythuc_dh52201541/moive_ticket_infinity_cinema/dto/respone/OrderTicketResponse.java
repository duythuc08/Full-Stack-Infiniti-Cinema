package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderTicketResponse {
    Long orderTicketId;
    String seatName;
    String roomName;
    String movieName;
    String showTime;
    BigDecimal price;
    SeatType seatType;
}
