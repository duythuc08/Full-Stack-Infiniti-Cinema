package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.PaymentType;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PaymentConfirmRequest {
    Long orderId;           // ID đơn hàng cần thanh toán
    String transactionId;   // Mã giao dịch (VD: VNP123456)
    String paymentInfo;     // Thông tin ngân hàng/ví (VD: NCB, VCB)
    PaymentType paymentType;// Loại thanh toán (CASH, BANKING, VNPAY...)
}
