package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.SeatShowTimeRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.SeatShowTimeResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.SeatShowTime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SeatShowTimeMapper {

    SeatShowTime toSeatShowTime(SeatShowTimeRequest request);

    // ========== THÊM DÒNG NÀY ==========
    // Map ID của bản ghi SeatShowTime (QUAN TRỌNG!)
    @Mapping(source = "seatShowTimeId", target = "seatShowTimeId")
    // ===================================

    // 1. Map thông tin User
    @Mapping(source = "users.userId", target = "userId")

    // 2. Map thông tin Ghế
    @Mapping(source = "seats.seatId", target = "seatId")
    @Mapping(source = "seats.seatRow", target = "seatRow")
    @Mapping(source = "seats.seatNumber", target = "seatNumber")
    @Mapping(source = "seats.seatType", target = "seatType")

    // 3. Map thông tin Suất chiếu & Phòng
    @Mapping(source = "showTimes.showTimeId", target = "showTimeId")
    @Mapping(source = "showTimes.rooms.roomId", target = "roomId")
    @Mapping(source = "showTimes.rooms.name", target = "roomName")
    @Mapping(source = "showTimes.rooms.roomType", target = "roomType")

    SeatShowTimeResponse toSeatShowTimeResponse(SeatShowTime seatShowTime);
}