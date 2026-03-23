package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.OrderTickets;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderTicketRepository extends JpaRepository<OrderTickets,String> {
    List<OrderTickets> findByOrders_OrderId(Long ordersOrderId);
    Optional<OrderTickets> findBySeatShowTime_SeatShowTimeId(Long seatShowTimeId);
    void deleteByOrders_OrderId(Long ordersOrderId);
}
