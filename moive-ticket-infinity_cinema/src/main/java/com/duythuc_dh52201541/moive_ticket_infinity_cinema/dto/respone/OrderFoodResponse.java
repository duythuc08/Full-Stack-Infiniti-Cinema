package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderFoodResponse {
    Long foodId;
    String name;
    Integer quantity;
    BigDecimal unitPrice;  // Giá của một đơn vị món ăn tại thời điểm đặt
    BigDecimal totalPrice;  // Thành tiền = quantity * unitPrice
}
