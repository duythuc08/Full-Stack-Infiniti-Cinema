package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Payments;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payments,String> {
    Optional<Payments> findByOrder_OrderId(Long orderOrderId);

    // Tìm theo mã giao dịch của cổng thanh toán (để đối soát)
    Optional<Payments> findByTransactionId(String transactionId);
}
