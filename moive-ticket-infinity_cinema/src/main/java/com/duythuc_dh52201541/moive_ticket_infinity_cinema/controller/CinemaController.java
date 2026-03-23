package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.CinemaRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.CinemaResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.CinemaService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/cinemas")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CinemaController {
    CinemaService cinemaService;

    @PostMapping
    ApiResponse<CinemaResponse> createCinema(@RequestBody CinemaRequest cinemaRequest){
        return ApiResponse.<CinemaResponse>builder()
                .result(cinemaService.createCinema(cinemaRequest))
                .message("Thêm cinema thành công !")
                .build();
    }
    @PostMapping("bluk")
    ApiResponse<List<CinemaResponse>> createCinema(@RequestBody List<CinemaRequest> cinemaRequest){
        return ApiResponse.<List<CinemaResponse>>builder()
                .result(cinemaService.createCinemas(cinemaRequest))
                .message("Thêm cinema thành công !")
                .build();
    }

    @GetMapping("getCinemas")
    ApiResponse<List<CinemaResponse>> getCinemas() {
        return ApiResponse.<List<CinemaResponse>>builder()
                .result(cinemaService.getCinemas())
                .build();
    }

    @GetMapping("getCinema/{id}")
    ApiResponse<CinemaResponse> getCinemaById(@PathVariable Long id){
        return ApiResponse.<CinemaResponse>builder()
                .result(cinemaService.getCinemaById(id))
                .build();
    }

}
