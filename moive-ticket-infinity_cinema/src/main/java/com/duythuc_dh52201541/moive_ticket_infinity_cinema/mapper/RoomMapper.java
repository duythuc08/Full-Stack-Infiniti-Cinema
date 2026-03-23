package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.RoomRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.RoomResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    Rooms toRooms(RoomRequest request);

    RoomResponse toRoomResponse(Rooms rooms);
}
