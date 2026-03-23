package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderFoodResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderTicketResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.OrderFoods;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.OrderTickets;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Orders;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(source = "users.userId", target = "userId")
    @Mapping(target = "fullName", expression = "java(orders.getUsers().getFirstname() + \" \" + orders.getUsers().getLastname())")
    @Mapping(source = "orderTickets", target = "tickets")
    @Mapping(source = "orderFoods", target = "foods")
    OrderResponse toOrderResponse(Orders orders);

    // Thêm mapping chi tiết cho từng vé ở đây
    @Mapping(target = "seatName", expression = "java(orderTickets.getSeatShowTime().getSeats().getSeatRow() + String.valueOf(orderTickets.getSeatShowTime().getSeats().getSeatNumber()))")
    @Mapping(source = "seatShowTime.seats.seatType", target = "seatType")
    @Mapping(source = "seatShowTime.showTimes.rooms.name", target = "roomName")
    @Mapping(source = "seatShowTime.showTimes.movies.title", target = "movieName")
    @Mapping(source = "seatShowTime.showTimes.startTime", target = "showTime")
    OrderTicketResponse toTicketResponse(OrderTickets orderTickets);

    @Mapping(source = "foods.foodId", target = "foodId")
    @Mapping(source = "foods.name", target = "name")
    OrderFoodResponse toFoodResponse(OrderFoods orderFoods);

    List<OrderResponse> toOrderResponseList(List<Orders> orders);
}
