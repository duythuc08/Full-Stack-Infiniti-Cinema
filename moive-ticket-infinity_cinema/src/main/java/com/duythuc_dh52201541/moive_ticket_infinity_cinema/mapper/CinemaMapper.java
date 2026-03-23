package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.CinemaRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.CinemaResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CinemaMapper {
    Cinemas toCinemas(CinemaRequest request);

    CinemaResponse toCinemasResponse(Cinemas cinemas);
}
