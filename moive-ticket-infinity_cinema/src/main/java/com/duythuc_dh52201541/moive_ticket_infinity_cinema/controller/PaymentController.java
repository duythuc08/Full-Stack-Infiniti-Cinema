package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.configuration.VNPayConfig;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.BookingRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.PaymentConfirmRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.BookingResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.OrderResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Orders;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.PaymentType;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.OrderRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.BookingService;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.PaymentService;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PaymentController {
    PaymentService paymentService;
    VNPayService vnPayService;
    OrderRepository orderRepository;
    BookingService bookingService;

    // API MỚI:  Tạo Order + URL Thanh toán VNPay trong 1 request
    @PostMapping("/create-vnpay-booking")
    public ApiResponse<BookingResponse> createVnPayBooking(
            HttpServletRequest request,
            @RequestBody BookingRequest bookingRequest) {

        // 1. Gọi BookingService để tạo Order
        OrderResponse orderResponse = bookingService.createBooking(bookingRequest);

        // 2. Lấy Order vừa tạo để generate URL thanh toán
        Orders order = orderRepository.findByOrderId(orderResponse.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        // 3. Tạo URL thanh toán VNPay
        String paymentUrl = vnPayService.createPaymentUrl(request, order);

        // 4. Build response đầy đủ cho Frontend
        BookingResponse response = BookingResponse.builder()
                // Thông tin đơn hàng
                .orderId(orderResponse.getOrderId())
                .userId(orderResponse.getUserId())
                .fullName(orderResponse.getFullName())
                .orderStatus(orderResponse.getOrderStatus())
                // Thông tin giá tiền
                .totalTicketPrice(orderResponse.getTotalTicketPrice())
                .totalFoodPrice(orderResponse.getTotalFoodPrice())
                .discountAmount(orderResponse.getDiscountAmount())
                .finalPrice(orderResponse.getFinalPrice())
                .promotionCode(orderResponse. getPromotionCode())
                // Thông tin thời gian
                .bookingTime(orderResponse.getBookingTime())
                .expiredTime(orderResponse.getExpiredTime())
                // Chi tiết vé & đồ ăn
                .tickets(orderResponse.getTickets())
                .foods(orderResponse.getFoods())
                // URL thanh toán VNPay
                .paymentUrl(paymentUrl)
                .build();

        return ApiResponse.<BookingResponse>builder()
                .code(1000)
                .message("Tạo đơn hàng và URL thanh toán thành công")
                .result(response)
                .build();
    }

    // 1. API Tạo URL Thanh toán VNPay
    // User gọi API này sau khi đã có OrderID từ BookingController
    @GetMapping("/create-vnpay-url")
    public ApiResponse<String> createVnPayUrl(HttpServletRequest request, @RequestParam Long orderId) {
        Orders order = orderRepository.findByOrderId(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        String paymentUrl = vnPayService.createPaymentUrl(request, order);

        return ApiResponse.<String>builder()
                .message("Tạo URL thanh toán thành công")
                .result(paymentUrl)
                .build();
    }

    // 2. API Callback từ VNPay (VNPay sẽ redirect về đây)
    @GetMapping("/vnpay-callback")
    public RedirectView vnpayCallback(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        String txnRef = request.getParameter("vnp_TxnRef"); // Chính là OrderId mình gửi đi

        // --- Verify Checksum để đảm bảo dữ liệu toàn vẹn ---
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) fields.remove("vnp_SecureHashType");
        if (fields.containsKey("vnp_SecureHash")) fields.remove("vnp_SecureHash");

        String signValue = VNPayConfig.hmacSHA512(VNPayConfig.secretKey, hashAllFields(fields));
        // ----------------------------------------------------

        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(status)) {
                // THANH TOÁN THÀNH CÔNG
                // Tạo PaymentConfirmRequest để tái sử dụng logic trong PaymentService
                PaymentConfirmRequest confirmReq = new PaymentConfirmRequest();
                confirmReq.setOrderId(Long.parseLong(txnRef));
                confirmReq.setTransactionId(request.getParameter("vnp_TransactionNo"));
                confirmReq.setPaymentInfo(request.getParameter("vnp_OrderInfo"));
                confirmReq.setPaymentType(PaymentType.VNPAY); // Giả sử bạn đã thêm VNPAY vào Enum

                // Gọi Service xử lý (Lưu payment, update vé, tạo QR, gửi mail)
                paymentService.processSuccess(confirmReq);

                // Redirect về trang Frontend thông báo thành công
                return new RedirectView("http://localhost:5173/payment-success/" + txnRef);
            } else {
                // THANH TOÁN THẤT BẠI
                Orders order = orderRepository.findByOrderId(Long.parseLong(txnRef)).orElse(null);
                if(order != null) paymentService.processFail(order);

                return new RedirectView("http://localhost:5173/payment-fail?vnp_ResponseCode=" + status + "&orderId=" + txnRef);
            }
        } else {
            return new RedirectView("http://localhost:5173/payment-error");
        }
    }

    // Helper function hash
    private String hashAllFields(Map<String, String> fields) {
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder sb = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                sb.append(fieldName);
                sb.append("=");
                try {
                    sb.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    sb.append("&");
                }
            }
        }
        return sb.toString();
    }
}