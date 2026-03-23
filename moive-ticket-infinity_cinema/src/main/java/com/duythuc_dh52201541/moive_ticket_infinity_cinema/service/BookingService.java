package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.BookingRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.OrderFoodsRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderFoodResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderTicketResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.*;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.*;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.*;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BookingService {
    OrderRepository orderRepository;
    OrderTicketRepository orderTicketRepository;
    OrderFoodRepository orderFoodRepository;
    SeatShowTimeRepository seatShowTimeRepository;
    FoodRepository foodRepository;
    UserRepository userRepository;
    ShowTimePriceService showTimePriceService;
    PromotionRepository promotionRepository;

    private static final int HOLD_SEAT_MINUTES = 5;

    @Transactional(rollbackOn = Exception.class)
    public OrderResponse createBooking(BookingRequest request) {
        // 1. LẤY THỜI GIAN CHUẨN (Dùng chung cho toàn bộ hàm)
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expirationTime = now.plusMinutes(HOLD_SEAT_MINUTES);

        // 1. Kiểm tra user đặt vé
        Users user = userRepository.findByUserId(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2. Kiểm tra và lock ghế được chọn
        List<SeatShowTime> seats = seatShowTimeRepository.findAllBySeatShowTimeIdIn(request.getSeatShowTimeIds());
        if (seats.size() != request.getSeatShowTimeIds().size()) {
            throw new RuntimeException("Dữ liệu ghế không hợp lệ");
        }
        for (SeatShowTime seat : seats) {
            boolean isAvailable = false;

            if (seat.getSeatShowTimeStatus() == SeatShowTimeStatus.AVAILABLE) {
                isAvailable = true;
            } else if (seat.getSeatShowTimeStatus() == SeatShowTimeStatus.RESERVED) {
                if (seat.getLockedUntil() != null && seat.getLockedUntil().isBefore(now)) {
                    isAvailable = true;
                }
            }

            if (!isAvailable) {
                throw new RuntimeException("Ghế " + seat.getSeats().getSeatRow() + seat.getSeats().getSeatNumber() + " đã có người đặt hoặc đang được giữ!");
            }

            seat.setUsers(user);
            seat.setSeatShowTimeStatus(SeatShowTimeStatus.RESERVED);
            seat.setLockedUntil(expirationTime);
        }
        seatShowTimeRepository.saveAll(seats);

        // 3. Tạo order với trạng trạng thái đang chờ thanh toán
        Orders order = Orders.builder()
                .users(user)
                .bookingTime(now)
                .createdAt(now)
                .expiredTime(expirationTime)
                .orderStatus(OrderStatus.PENDING)
                .build();
        orderRepository.save(order);

        // 4. Tạo orderTicket
        BigDecimal totalTicketPrice = BigDecimal.ZERO;
        List<OrderTickets> tickets = new ArrayList<>();
        Long showTimeId = seats.get(0).getShowTimes().getShowTimeId();
        Map<SeatType, BigDecimal> priceMap = showTimePriceService.getPriceMapByShowTime(showTimeId);

        for (SeatShowTime seat : seats) {
            SeatType currentSeatType = seat.getSeats().getSeatType();
            BigDecimal price = priceMap.get(currentSeatType);
            if (price == null) {
                throw new RuntimeException("Lỗi hệ thống: Không tìm thấy giá cho ghế loại " + currentSeatType);
            }

            OrderTickets ticket = OrderTickets.builder()
                    .orders(order)
                    .seatShowTime(seat)
                    .price(price)
                    .ticketStatus(TicketStatus.RESERVED)
                    .createdAt(now)
                    .build();
            tickets.add(ticket);
            totalTicketPrice = totalTicketPrice.add(price);
        }
        orderTicketRepository.saveAll(tickets);

        // 5. Tạo oderFood nếu khách có chọn thêm đồ ăn
        List<OrderFoods> orderFoods = new ArrayList<>();
        BigDecimal totalFoodPrice = BigDecimal.ZERO;
        if (request.getFoods() != null) {
            for (OrderFoodsRequest foodReq : request.getFoods()) {
                Foods food = foodRepository.findByFoodId(foodReq.getFoodId())
                        .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
                BigDecimal totalItem = food.getPrice().multiply(BigDecimal.valueOf(foodReq.getQuantity()));

                OrderFoods item = OrderFoods.builder()
                        .orders(order)
                        .foods(food)
                        .quantity(foodReq.getQuantity())
                        .unitPrice(food.getPrice())
                        .totalPrice(totalItem)
                        .build();
                orderFoods.add(item);
                totalFoodPrice = totalFoodPrice.add(totalItem);
            }
        }
        orderFoodRepository.saveAll(orderFoods);

        // 6. XỬ LÝ ƯU ĐÃI (HẠNG THÀNH VIÊN & MÃ GIẢM GIÁ)
        BigDecimal provisionalTotal = totalTicketPrice.add(totalFoodPrice);

        // --- Xử lý giảm giá Hạng thành viên && giảm giá sinh nhật ---
        BigDecimal memberDiscountAmount = BigDecimal.ZERO;
        if (user.getMembershipTier() != null) {
            BigDecimal applicablePercent = BigDecimal.ZERO;

            // Kiểm tra nếu là tháng sinh nhật
            if (user.getBirthday() != null && user.getBirthday().getMonth() == now.getMonth()) {
                // Nếu là tháng sinh nhật -> Lấy % giảm giá sinh nhật
                applicablePercent = user.getMembershipTier().getBirthdayDiscount();
            } else {
                // Nếu không phải tháng sinh nhật -> Lấy % giảm giá của hạng thành viên
                applicablePercent = user.getMembershipTier().getDiscountPercent();
            }

            // Tính số tiền được giảm (áp dụng % đã chọn ở trên)
            if (applicablePercent.compareTo(BigDecimal.ZERO) > 0) {
                memberDiscountAmount = provisionalTotal.multiply(applicablePercent)
                        .divide(new BigDecimal(100), RoundingMode.HALF_UP);
            }
        }

        BigDecimal amountAfterMemberDiscount = provisionalTotal.subtract(memberDiscountAmount);
        // --- Xử lý Mã giảm giá (Promotion) ---
        BigDecimal promotionDiscount = BigDecimal.ZERO;
        String appliedPromotionCode = null;
        if (request.getPromotionCode() != null && !request.getPromotionCode().trim().isEmpty()) {
            Promotion promotion = promotionRepository.findByCode(request.getPromotionCode())
                    .orElseThrow(() -> new AppException(ErrorCode.PROMOTION_NOT_FOUND));

            if (promotion.getEndTime().isBefore(now) || promotion.getStartTime().isAfter(now)) {
                throw new AppException(ErrorCode.PROMOTION_EXPIRED);
            }
            if (promotion.getUseLimit() <= 0) {
                throw new AppException(ErrorCode.PROMOTION_OUT_OF_STOCK);
            }
            if (amountAfterMemberDiscount.compareTo(promotion.getMinOrderValue()) < 0) {
                throw new AppException(ErrorCode.PROMOTION_CONDITION_NOT_MET);
            }

            if (promotion.getType().equals(PromotionType.PERCENTAGE)) {
                BigDecimal percentage = promotion.getDiscountValue().divide(new BigDecimal(100));
                promotionDiscount = amountAfterMemberDiscount.multiply(percentage);
                if (promotion.getMaxDiscountAmount() != null && promotionDiscount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
                    promotionDiscount = promotion.getMaxDiscountAmount();
                }
            } else if (promotion.getType().equals(PromotionType.FIXED_AMOUNT)) {
                promotionDiscount = promotion.getDiscountValue();
            }

            if (promotionDiscount.compareTo(amountAfterMemberDiscount) > 0) {
                promotionDiscount = amountAfterMemberDiscount;
            }

            promotion.setUseLimit(promotion.getUseLimit() - 1);
            promotionRepository.save(promotion);
            appliedPromotionCode = promotion.getCode();
        }

        // 7. CẬP NHẬT VÀ LƯU ORDER CUỐI CÙNG
        BigDecimal finalPrice = amountAfterMemberDiscount.subtract(promotionDiscount);
        if (finalPrice.compareTo(BigDecimal.ZERO) < 0) finalPrice = BigDecimal.ZERO;

        // --- Tính điểm tích lũy dự kiến (Tỷ lệ 1.000đ = 1 điểm) ---
        int pointsEarned = finalPrice.divide(new BigDecimal(1000), 0, RoundingMode.FLOOR).intValue();

        order.setTotalFoodPrice(totalFoodPrice);
        order.setTotalTicketPrice(totalTicketPrice);
        order.setMemberDiscountAmount(memberDiscountAmount); // Lưu giảm giá hạng thẻ
        order.setDiscountAmount(promotionDiscount);         // Lưu giảm giá mã khuyến mãi
        order.setPromotionCode(appliedPromotionCode);
        order.setFinalPrice(finalPrice);
        order.setPointsEarned(pointsEarned);                 // Lưu điểm tích lũy dự kiến
        order.setUpdatedAt(now);

        Orders savedOrder = orderRepository.save(order);

        // 8. CHUẨN BỊ RESPONSE
        List<OrderTicketResponse> ticketResponses = tickets.stream()
                .map(ticket -> OrderTicketResponse.builder()
                        .orderTicketId(ticket.getOrderTicketId())
                        .seatName(ticket.getSeatShowTime().getSeats().getSeatRow() + ticket.getSeatShowTime().getSeats().getSeatNumber())
                        .price(ticket.getPrice())
                        .seatType(ticket.getSeatShowTime().getSeats().getSeatType())
                        .build())
                .toList();

        List<OrderFoodResponse> foodResponses = orderFoods.stream()
                .map(food -> OrderFoodResponse.builder()
                        .foodId(food.getFoods().getFoodId())
                        .name(food.getFoods().getName())
                        .quantity(food.getQuantity())
                        .unitPrice(food.getUnitPrice())
                        .totalPrice(food.getTotalPrice())
                        .build())
                .toList();

        return OrderResponse.builder()
                .orderId(savedOrder.getOrderId())
                .userId(savedOrder.getUsers().getUserId())
                .fullName(savedOrder.getUsers().getFirstname() + " " + savedOrder.getUsers().getLastname())
                .totalTicketPrice(savedOrder.getTotalTicketPrice())
                .totalFoodPrice(savedOrder.getTotalFoodPrice())
                .memberDiscountAmount(savedOrder.getMemberDiscountAmount()) // Trả về cho Response
                .discountAmount(savedOrder.getDiscountAmount())
                .promotionCode(savedOrder.getPromotionCode())
                .finalPrice(savedOrder.getFinalPrice())
                .pointsEarned(savedOrder.getPointsEarned())               // Trả về cho Response
                .bookingTime(savedOrder.getBookingTime())
                .expiredTime(savedOrder.getExpiredTime())
                .createdAt(savedOrder.getCreatedAt())
                .updatedAt(savedOrder.getUpdatedAt())
                .orderStatus(savedOrder.getOrderStatus())
                .tickets(ticketResponses)
                .foods(foodResponses)
                .qrCode(savedOrder.getQrCode())
                .build();
    }
}