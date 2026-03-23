package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.ShowTimeRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.SeatShowTimeResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ShowTimeResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.SeatShowTimeMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.SeatShowTimeRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.ShowTimeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SeatShowTimeService {
    SeatShowTimeMapper seatShowTimeMapper;
    SeatShowTimeRepository seatShowTimeRepository;

    final ShowTimeRepository showTimeRepository;



    public List<SeatShowTimeResponse> getAllSeatShowTimesByShowTime(Long showTimeId) {
        if(!showTimeRepository.existsByShowTimeId(showTimeId)){
            throw new AppException(ErrorCode.SHOWTIME_NOT_FOUND);
        }
        return seatShowTimeRepository.findByShowTimes_ShowTimeId(showTimeId)
                .stream()
                .map(seatShowTimeMapper::toSeatShowTimeResponse)
                .toList();
    }

}
