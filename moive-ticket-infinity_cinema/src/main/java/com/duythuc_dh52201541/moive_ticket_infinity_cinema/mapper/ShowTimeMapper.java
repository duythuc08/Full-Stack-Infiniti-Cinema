package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.ShowTimeRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ShowTimeResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ShowTimeMapper {
    ShowTimes  toShowTimes(ShowTimeRequest request);

    ShowTimeResponse toShowTimeResponse(ShowTimes showTimes);
}
