package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.FoodStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.FoodType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Lob;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FoodRequest {
    String name;  // Tên món ăn / combo
    @Lob
    String description;  // Mô tả chi tiết món ăn
    BigDecimal price;  // Giá bán của món ăn
    String imageUrl;  // Đường dẫn hình ảnh minh họa món ăn
    Boolean isCombo;  // Có phải combo hay không (true = combo, false = món lẻ)
    Integer stockQuantity;  // Số lượng tồn kho hiện tại
    FoodType foodType;  // Loại món ăn (nước uống, bắp rang, combo,...)
    FoodStatus foodStatus;  // Trạng thái món ăn (đang bán, ngừng bán,...)
}
