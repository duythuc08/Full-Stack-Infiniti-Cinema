package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name="order_food")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class OrderFoods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long orderFoodId;  // ID chi tiết món ăn trong đơn hàng (khóa chính)

    Integer quantity;  // Số lượng món ăn được đặt
    BigDecimal unitPrice;  // Giá của một đơn vị món ăn tại thời điểm đặt
    BigDecimal totalPrice;  // Thành tiền = quantity * unitPrice

    @ManyToOne
    @JoinColumn(name = "order_id")
    Orders orders;  // Đơn hàng chứa món ăn này (nhiều món ăn thuộc 1 đơn hàng)

    @ManyToOne
    @JoinColumn(name = "food_id")
    Foods foods;  // Món ăn cụ thể (1 món ăn có thể xuất hiện trong nhiều đơn hàng)
}

