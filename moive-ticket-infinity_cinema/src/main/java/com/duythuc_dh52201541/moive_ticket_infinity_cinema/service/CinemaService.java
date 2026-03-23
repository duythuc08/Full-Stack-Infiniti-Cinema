package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.CinemaRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.CinemaResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.CinemaStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.CinemaMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.CinemaRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class CinemaService {
    CinemaRepository cinemaRepository;
    CinemaMapper cinemaMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public CinemaResponse createCinema(CinemaRequest request){
        if(cinemaRepository.existsByName(request.getName())){
            throw new AppException(ErrorCode.CINEMA_EXISTED);
        }
        Cinemas cinemas = cinemaMapper.toCinemas(request);
        return cinemaMapper.toCinemasResponse(cinemaRepository.save(cinemas));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<CinemaResponse> createCinemas(List<CinemaRequest> requests){
        return requests.stream()
                .map(request -> {
                    if(cinemaRepository.existsByName(request.getName())){
                        throw new AppException(ErrorCode.CINEMA_EXISTED);
                    }
                    Cinemas cinemas = cinemaMapper.toCinemas(request);
                    return cinemaMapper.toCinemasResponse(cinemaRepository.save(cinemas));
                })
                .toList();
    }


    public List<CinemaResponse> getCinemas(){
        return cinemaRepository.findAll()
                .stream()
                .map(cinemaMapper ::toCinemasResponse)
                .toList();
    }

    public CinemaResponse getCinemaById(Long cinemaId){
        Cinemas cinemas = cinemaRepository.findByCinemaId(cinemaId)
                .orElseThrow(() -> new AppException(ErrorCode.CINEMA_NOT_FOUND));
        return cinemaMapper.toCinemasResponse(cinemas);
    }

    public List<CinemaResponse> getCinemaStatus(CinemaStatus cinemaStatus){
        return cinemaRepository.findByCinemaStatus(cinemaStatus)
                .stream()
                .map(cinemaMapper::toCinemasResponse)
                .toList();
    }
}
