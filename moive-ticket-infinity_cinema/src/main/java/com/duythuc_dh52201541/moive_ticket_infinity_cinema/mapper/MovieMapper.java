package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.MovieCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.AdminMovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.MovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MovieMapper {
    Movies toMovies(MovieCreationRequest request);

    MovieResponse toMovieResponse(Movies movies);

    AdminMovieResponse toAdminMovieResponse(Movies movies);

}
