package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShowTimeResponse {
    Long showTimeId;
    LocalDateTime startTime;
    LocalDateTime endTime;
    String showTimeStatus;

    // SỬA: Dùng DTO con hoặc Object rút gọn, KHÔNG DÙNG ENTITY
    Movies movies;
    Rooms rooms;
}
