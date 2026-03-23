package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.MovieCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.AdminMovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.MovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.MovieService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/movies")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MovieController {
    MovieService movieService;

    @PostMapping
    ApiResponse<MovieResponse> createMovie(@RequestBody @Valid MovieCreationRequest request){
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.createMovie(request))
                .message("Thêm phim mới thành công")
                .build();
    }

    @GetMapping
    ApiResponse<List<AdminMovieResponse>> getAdminMovie(){
        return ApiResponse.<List<AdminMovieResponse>>builder()
                .result(movieService.getAdminMovies())
                .build();
    }

    @GetMapping("/getMovies")
    ApiResponse<List<MovieResponse>> getMovies(){
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getMovies())
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<MovieResponse> getMovieById(@PathVariable Long id) {
        return ApiResponse.<MovieResponse>builder()
                .result(movieService.getMovieById(id))
                .build();
    }
    @GetMapping("/showing")
    ApiResponse<List<MovieResponse>> getShowingMovies(){
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getMoviesShowing())
                .build();
    }

    @GetMapping("/comingSoon")
    ApiResponse<List<MovieResponse>> getComingSoonMovies(){
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getMoviesComingSoon())
                .build();
    }
    @GetMapping("/imax")
    ApiResponse<List<MovieResponse>> getImaxMovies(){
        return ApiResponse.<List<MovieResponse>>builder()
                .result(movieService.getMoviesImax())
                .build();
    }
}
