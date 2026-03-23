package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.GenreCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.GenreResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.GenreService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class GenreController {
    GenreService genreService;

    @PostMapping
    ApiResponse<GenreResponse> createGenre(@RequestBody @Valid GenreCreationRequest request) {
        return ApiResponse.<GenreResponse>builder()
                .result(genreService.createGenre(request))
                .message("Thêm genre thành công")
                .build();
    }
}
