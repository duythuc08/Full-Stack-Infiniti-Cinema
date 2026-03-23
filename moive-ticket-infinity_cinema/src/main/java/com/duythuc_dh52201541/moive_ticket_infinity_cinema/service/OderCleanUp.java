package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Orders;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.OrderStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j  // Thêm logging
@Component
@RequiredArgsConstructor
public class OderCleanUp {
    private final OrderRepository orderRepo;
    private final PaymentService paymentService;

    @Scheduled(fixedRate = 60000) // Chạy mỗi phút 1 lần
    public void cleanupExpiredOrders() {
        try {
            // Tìm các order PENDING đã quá thời gian hết hạn
            List<Orders> expiredOrders = orderRepo.findAllByOrderStatusAndExpiredTimeBefore(
                    OrderStatus.PENDING, LocalDateTime.now());

            if (expiredOrders.isEmpty()) {
                return;
            }

            int successCount = 0;
            int failCount = 0;

            for (Orders order : expiredOrders) {
                try {
                    paymentService.processFail(order); // Gọi logic nhả ghế
                    successCount++;
                } catch (Exception e) {
                    failCount++;
                    log.error("Failed to process expired order {}:  {}",
                            order.getOrderId(), e.getMessage(), e);
                    // Không throw exception để tiếp tục xử lý các orders khác
                }
            }

        } catch (Exception e) {
            log.error("Error during cleanup process:  {}", e.getMessage(), e);
        }
    }
}