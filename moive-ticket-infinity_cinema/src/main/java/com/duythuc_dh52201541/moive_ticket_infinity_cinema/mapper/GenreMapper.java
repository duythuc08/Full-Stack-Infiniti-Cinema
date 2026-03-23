package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.GenreCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.GenreResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Genre;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface GenreMapper {
    Genre toGenre(GenreCreationRequest request);

    GenreResponse toGenreRespone(Genre genre);
}
