package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimePriceRequest {
    Long showTimeId;
    SeatType seatType;
    BigDecimal price;
}
