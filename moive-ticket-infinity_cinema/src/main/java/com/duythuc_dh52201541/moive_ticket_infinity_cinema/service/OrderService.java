package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderFoodResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderTicketResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.*;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.OrderMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.OrderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class OrderService {

    OrderRepository orderRepository;
    OrderMapper orderMapper;

    public OrderResponse getOrderById(Long orderId) {
        try {
            // 1. Tìm đơn hàng
            Orders order = orderRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

            // 2. Lấy thông tin người dùng
            String userId = null;
            String fullName = "---";
            if (order.getUsers() != null) {
                userId = order.getUsers().getUserId(); // UUID
                fullName = order.getUsers().getFirstname() + " " + order.getUsers().getLastname();
            }

            // 3. Map danh sách vé
            List<OrderTicketResponse> ticketResponses = new ArrayList<>();
            if (order.getOrderTickets() != null) {
                for (OrderTickets ticket : order.getOrderTickets()) {
                    if (ticket.getSeatShowTime() != null && ticket.getSeatShowTime().getSeats() != null) {
                        Seats seat = ticket.getSeatShowTime().getSeats();
                        ShowTimes st = ticket.getSeatShowTime().getShowTimes();

                        String ticketRoomName   = (st != null && st.getRooms() != null)    ? st.getRooms().getName()           : null;
                        String ticketMovieName  = (st != null && st.getMovies() != null)   ? st.getMovies().getTitle()         : null;
                        String ticketShowTime   = (st != null && st.getStartTime() != null) ? st.getStartTime().toString()     : null;

                        ticketResponses.add(OrderTicketResponse.builder()
                                .orderTicketId(ticket.getOrderTicketId())
                                .seatName(seat.getSeatRow() + seat.getSeatNumber())
                                .seatType(seat.getSeatType())
                                .price(ticket.getPrice())
                                .roomName(ticketRoomName)
                                .movieName(ticketMovieName)
                                .showTime(ticketShowTime)
                                .build());
                    }
                }
            }

            // 4. Map danh sách đồ ăn (Giữ nguyên logic của bạn)
            List<OrderFoodResponse> foodResponses = new ArrayList<>();
            if (order.getOrderFoods() != null) {
                for (OrderFoods food : order.getOrderFoods()) {
                    foodResponses.add(OrderFoodResponse.builder()
                            .foodId(food.getFoods().getFoodId())
                            .name(food.getFoods().getName())
                            .quantity(food.getQuantity())
                            .unitPrice(food.getUnitPrice())
                            .totalPrice(food.getTotalPrice())
                            .build());
                }
            }

            // 5. Trích xuất thông tin phim / rạp / phòng chiếu từ vé đầu tiên
            String movieTitle = null;
            String cinemaName = null;
            String cinemaAddress = null;
            String showTimeStr = null;
            String roomName = null;

            if (order.getOrderTickets() != null && !order.getOrderTickets().isEmpty()) {
                OrderTickets firstTicket = order.getOrderTickets().iterator().next();
                if (firstTicket.getSeatShowTime() != null) {
                    ShowTimes st = firstTicket.getSeatShowTime().getShowTimes();
                    if (st != null) {
                        if (st.getMovies() != null) movieTitle = st.getMovies().getTitle();
                        if (st.getStartTime() != null) showTimeStr = st.getStartTime().toString();
                        Rooms room = st.getRooms();
                        if (room != null) {
                            roomName = room.getName();
                            Cinemas cinema = room.getCinemas();
                            if (cinema != null) {
                                cinemaName = cinema.getName();
                                cinemaAddress = cinema.getAddress();
                            }
                        }
                    }
                }
            }

            // 6. Build Response
            return OrderResponse.builder()
                    .orderId(order.getOrderId())
                    .userId(userId)
                    .fullName(fullName)
                    .totalTicketPrice(order.getTotalTicketPrice())
                    .totalFoodPrice(order.getTotalFoodPrice())
                    .memberDiscountAmount(order.getMemberDiscountAmount())
                    .discountAmount(order.getDiscountAmount())
                    .pointsEarned(order.getPointsEarned())
                    .finalPrice(order.getFinalPrice())
                    .promotionCode(order.getPromotionCode())
                    .orderStatus(order.getOrderStatus())
                    .bookingTime(order.getBookingTime())
                    .expiredTime(order.getExpiredTime())
                    .createdAt(order.getCreatedAt())
                    .updatedAt(order.getUpdatedAt())
                    .qrCode(order.getQrCode())
                    .tickets(ticketResponses)
                    .foods(foodResponses)
                    .movieTitle(movieTitle)
                    .cinemaName(cinemaName)
                    .cinemaAddress(cinemaAddress)
                    .showTime(showTimeStr)
                    .roomName(roomName)
                    .build();

        } catch (AppException e) {
            log.error("AppException: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error getting order: " + e.getMessage(), e);
        }
    }

    // Phương thức này sử dụng MapStruct, hãy chắc chắn bạn đã cập nhật OrderMapper
    public List<OrderResponse> getOrdersByUserId(String userId){
        return orderRepository.findByUsers_UserId(userId)
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }
}