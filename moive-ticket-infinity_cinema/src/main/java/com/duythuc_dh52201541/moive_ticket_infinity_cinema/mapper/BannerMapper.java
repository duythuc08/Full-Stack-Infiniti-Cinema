package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.BannerRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.BannerResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Banner;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.BannerType;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BannerMapper {
    Banner toBanner(BannerRequest request);
    BannerResponse toBannerResponse(Banner banner);
}
