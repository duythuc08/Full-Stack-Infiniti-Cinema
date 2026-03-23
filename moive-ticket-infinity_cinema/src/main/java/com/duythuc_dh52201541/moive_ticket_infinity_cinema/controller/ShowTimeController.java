package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.ShowTimeRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ShowTimeResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.ShowTimeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/showtimes")
@RequiredArgsConstructor
public class ShowTimeController {

    private final ShowTimeService showTimeService;

    @PostMapping
    public ApiResponse<ShowTimeResponse> createShowTime(@RequestBody ShowTimeRequest request){
        return ApiResponse.<ShowTimeResponse>builder()
                .result(showTimeService.createShowTime(request))
                .message("Them suat chieu moi thanh cong")
                .build();
    }
    @PostMapping("/bluk")
    public ApiResponse<List<ShowTimeResponse>> createShowTimes(@RequestBody List<ShowTimeRequest> requests){
        return ApiResponse.<List<ShowTimeResponse>>builder()
                .result(showTimeService.createShowTimes(requests))
                .message("Them suat chieu moi thanh cong")
                .build();
    }


    @GetMapping("/getShowTimes")
    public ApiResponse<List<ShowTimeResponse>> getShowTimeAll(){
        return ApiResponse.<List<ShowTimeResponse>>builder()
                .result(showTimeService.getAllShowTimes())
                .build();
    }

    // 1. API: lấy suất chiếu của một phim trong khoảng thời gian
    //GET /showtimes/getShowTimes/by-movie/{movieId}?start=2025-11-27T00:00:00&end=2025-11-27T23:59:59
    @GetMapping("/getShowTimes/by-movie-time/{movieId}")
    public ApiResponse<List<ShowTimeResponse>> getShowTimesByMovieAndTimeRange(
            @PathVariable Long movieId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ApiResponse.<List<ShowTimeResponse>>builder()
                .result(showTimeService.getShowTimesByMovieAndTimeRange(movieId, start, end))
                .build();
    }

    // 2. API: lấy lịch chiếu của một phim tại một rạp cụ thể
    //GET /showtimes/getShowTimes/by-cinema/{cinemaId}?movie=1
    @GetMapping("/getShowTimes/by-cinema/{cinemaId}")
    public ApiResponse<List<ShowTimeResponse>> getShowTimesByCinemaAndMovie(
            @PathVariable Long cinemaId,
            @RequestParam Long movieId) {
        return ApiResponse.<List<ShowTimeResponse>>builder()
                .result(showTimeService.getShowTimesByCinemaAndMovie(cinemaId, movieId, LocalDateTime.now()))
                .build();
    }

    // 3. API: lấy suất chiếu active của một phim trong khoảng thời gian
    //GET /showtimes/getShowTimes/active/by-movie/{movieId}?start=2025-11-27T00:00:00&end=2025-11-27T23:59:59
    @GetMapping("/getShowTimes/active/by-movie/{movieId}")
    public ApiResponse<List<ShowTimeResponse>> getActiveShowTimesByMovieAndRange(
            @PathVariable Long movieId,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ApiResponse.<List<ShowTimeResponse>>builder()
                .result(showTimeService.getActiveShowTimesByMovieAndRange(movieId, start, end))
                .build();
    }

    @GetMapping("/getShowTimes/by-movie/{movieId}")
    public ApiResponse<List<ShowTimeResponse>> getShowTimesByMovie(@PathVariable Long movieId) {
        return ApiResponse.<List<ShowTimeResponse>>builder()
                .result(showTimeService.getShowTimesByMovie(movieId))
                .build();
    }
}

