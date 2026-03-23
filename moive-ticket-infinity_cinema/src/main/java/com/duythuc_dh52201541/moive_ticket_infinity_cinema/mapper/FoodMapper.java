package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.FoodRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.FoodResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Foods;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FoodMapper {
    Foods toFoods(FoodRequest request);
    FoodResponse toFoodResponse(Foods foods);
}
