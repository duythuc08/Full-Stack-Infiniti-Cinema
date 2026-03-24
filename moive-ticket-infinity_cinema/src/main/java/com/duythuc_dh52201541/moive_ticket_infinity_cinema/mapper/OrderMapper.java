package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderFoodResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderTicketResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.OrderFoods;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.OrderTickets;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Orders;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    @Mapping(source = "users.userId", target = "userId")
    @Mapping(target = "fullName", expression = "java(orders.getUsers().getFirstname() + \" \" + orders.getUsers().getLastname())")
    @Mapping(source = "orderTickets", target = "tickets")
    @Mapping(source = "orderFoods", target = "foods")
    @Mapping(target = "movieTitle", ignore = true)
    @Mapping(target = "cinemaName", ignore = true)
    @Mapping(target = "cinemaAddress", ignore = true)
    @Mapping(target = "showTime", ignore = true)
    @Mapping(target = "roomName", ignore = true)
    OrderResponse toOrderResponse(Orders orders);

    // Mapping chi tiết cho từng vé — dùng expression để null-safe và handle type conversion
    @Mapping(target = "seatName",  expression = "java(orderTickets.getSeatShowTime().getSeats().getSeatRow() + String.valueOf(orderTickets.getSeatShowTime().getSeats().getSeatNumber()))")
    @Mapping(source = "seatShowTime.seats.seatType",       target = "seatType")
    @Mapping(source = "seatShowTime.showTimes.rooms.name", target = "roomName")
    @Mapping(source = "seatShowTime.showTimes.movies.title", target = "movieName")
    @Mapping(target = "showTime",  expression = "java(orderTickets.getSeatShowTime() != null && orderTickets.getSeatShowTime().getShowTimes() != null && orderTickets.getSeatShowTime().getShowTimes().getStartTime() != null ? orderTickets.getSeatShowTime().getShowTimes().getStartTime().toString() : null)")
    OrderTicketResponse toTicketResponse(OrderTickets orderTickets);

    @Mapping(source = "foods.foodId", target = "foodId")
    @Mapping(source = "foods.name", target = "name")
    OrderFoodResponse toFoodResponse(OrderFoods orderFoods);

    List<OrderResponse> toOrderResponseList(List<Orders> orders);

    /**
     * Sau khi MapStruct map xong OrderResponse, trích xuất thông tin
     * phim / rạp / phòng chiếu / suất chiếu từ vé đầu tiên.
     */
    @AfterMapping
    default void populateShowtimeInfo(Orders orders, @MappingTarget OrderResponse response) {
        if (orders.getOrderTickets() == null || orders.getOrderTickets().isEmpty()) return;

        OrderTickets firstTicket = orders.getOrderTickets().iterator().next();
        if (firstTicket.getSeatShowTime() == null) return;

        ShowTimes showTimes = firstTicket.getSeatShowTime().getShowTimes();
        if (showTimes == null) return;

        // Tên phim
        if (showTimes.getMovies() != null) {
            response.setMovieTitle(showTimes.getMovies().getTitle());
        }

        // Suất chiếu
        if (showTimes.getStartTime() != null) {
            response.setShowTime(showTimes.getStartTime().toString());
        }

        // Phòng chiếu + Rạp
        Rooms room = showTimes.getRooms();
        if (room != null) {
            response.setRoomName(room.getName());

            Cinemas cinema = room.getCinemas();
            if (cinema != null) {
                response.setCinemaName(cinema.getName());
                response.setCinemaAddress(cinema.getAddress());
            }
        }
    }
}
