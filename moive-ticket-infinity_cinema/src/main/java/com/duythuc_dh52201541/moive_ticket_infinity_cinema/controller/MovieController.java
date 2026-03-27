package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.MovieCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.AdminMovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.MovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.PagedMovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.MovieService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Không dùng spring-filter, pagination được xử lý qua @RequestParam page/size thủ công.

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
    /**
     * GET /movies/showing
     * Không truyền params → trả tất cả (dùng cho carousel trang chủ).
     * Truyền ?page=0&size=4 → phân trang (dùng cho từng "trang" 4 poster).
     */
    @GetMapping("/showing")
    ApiResponse<List<MovieResponse>> getShowingMovies(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        List<MovieResponse> result = (page != null && size != null)
                ? movieService.getMoviesShowingPaged(page, size)
                : movieService.getMoviesShowing();
        return ApiResponse.<List<MovieResponse>>builder().result(result).build();
    }

    @GetMapping("/comingSoon")
    ApiResponse<List<MovieResponse>> getComingSoonMovies(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        List<MovieResponse> result = (page != null && size != null)
                ? movieService.getMoviesComingSoonPaged(page, size)
                : movieService.getMoviesComingSoon();
        return ApiResponse.<List<MovieResponse>>builder().result(result).build();
    }

    @GetMapping("/imax")
    ApiResponse<List<MovieResponse>> getImaxMovies(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size) {
        List<MovieResponse> result = (page != null && size != null)
                ? movieService.getMoviesImaxPaged(page, size)
                : movieService.getMoviesImax();
        return ApiResponse.<List<MovieResponse>>builder().result(result).build();
    }

    // ─── Paginated endpoints — trả về PagedMovieResponse với totalPages ──────
    // GET /movies/showing/paged?page=0&size=4

    @GetMapping("/showing/paged")
    ApiResponse<PagedMovieResponse> getShowingMoviesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ApiResponse.<PagedMovieResponse>builder()
                .result(movieService.getShowingMoviesPagedResponse(page, size))
                .build();
    }

    @GetMapping("/comingSoon/paged")
    ApiResponse<PagedMovieResponse> getComingSoonMoviesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ApiResponse.<PagedMovieResponse>builder()
                .result(movieService.getComingSoonMoviesPagedResponse(page, size))
                .build();
    }

    @GetMapping("/imax/paged")
    ApiResponse<PagedMovieResponse> getImaxMoviesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return ApiResponse.<PagedMovieResponse>builder()
                .result(movieService.getImaxMoviesPagedResponse(page, size))
                .build();
    }
}
