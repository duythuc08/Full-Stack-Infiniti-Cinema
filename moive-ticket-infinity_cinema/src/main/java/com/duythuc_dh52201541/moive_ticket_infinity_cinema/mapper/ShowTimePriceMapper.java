package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.ShowTimePriceRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ShowTimePriceResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimePrice;
import org.mapstruct.Mapper;
import org.springframework.data.jpa.repository.JpaRepository;

@Mapper(componentModel = "spring")
public interface ShowTimePriceMapper {
    ShowTimePrice toShowTimePrice(ShowTimePriceRequest request);
    ShowTimePriceResponse toShowTimePriceResponse(ShowTimePrice showTimePrice);
}
