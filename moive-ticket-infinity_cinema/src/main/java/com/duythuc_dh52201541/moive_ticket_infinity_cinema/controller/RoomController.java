package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.RoomRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.RoomResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomType;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.RoomService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/rooms")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class RoomController {

    RoomService  roomService;

    @PostMapping
    ApiResponse<RoomResponse> createRoom(@RequestBody RoomRequest roomRequest) {
        return ApiResponse.<RoomResponse>builder()
                .result(roomService.createRoom(roomRequest))
                .build();
    }

    @PostMapping("/bluk")
    ApiResponse<List<RoomResponse>> createRooms(@RequestBody List<RoomRequest> roomRequests) {
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.createRooms(roomRequests))
                .build();
    }

    @GetMapping("/getRooms")
    ApiResponse<List<RoomResponse>> getAllRooms(){
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.getRooms())
                .build();
    }

    @GetMapping("/getRooms/by-cinema/{cinemaId}")
    ApiResponse<List<RoomResponse>> getRoomByCinemaId(@PathVariable Long cinemaId){
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.getRoomsByCinemaId(cinemaId))
                .build();
    }
    //http://localhost:8080/duythuc/rooms/getRooms/by-cinema/1/status?status=ACTIVE
    @GetMapping("/getRooms/by-cinema/{cinemaId}/status")
    ApiResponse<List<RoomResponse>> getRoomByCinemaIdAndStatus(@PathVariable Long cinemaId,@RequestParam RoomStatus status){
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.getRoomsByCinemaIdAndStatus(cinemaId,status))
                .build();
    }

    //http://localhost:8080/duythuc/rooms/getRooms/by-cinema/1/type?type=VIP
    @GetMapping("/getRooms/by-cinema/{cinemaId}/type")
    ApiResponse<List<RoomResponse>> getRoomByCinemaIdAndType(@PathVariable Long cinemaId,@RequestParam RoomType type){
        return ApiResponse.<List<RoomResponse>>builder()
                .result(roomService.getRoomsByCinemaIdAndType(cinemaId,type))
                .build();
    }
}
