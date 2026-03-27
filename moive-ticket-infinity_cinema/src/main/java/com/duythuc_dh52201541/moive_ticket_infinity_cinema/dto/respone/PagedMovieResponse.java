package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PagedMovieResponse {
    List<MovieResponse> content;
    int currentPage;
    int pageSize;
    int totalPages;
    long totalElements;
}
