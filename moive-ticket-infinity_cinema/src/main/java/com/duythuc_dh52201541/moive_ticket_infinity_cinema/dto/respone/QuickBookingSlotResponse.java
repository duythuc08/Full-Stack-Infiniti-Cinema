package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class QuickBookingSlotResponse {
    Long showTimeId;
    String startTime;
    String roomName;
    String roomType;
}
