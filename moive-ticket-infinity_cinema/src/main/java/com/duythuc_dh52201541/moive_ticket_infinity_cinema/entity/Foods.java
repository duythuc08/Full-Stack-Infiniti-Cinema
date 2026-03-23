package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.FoodStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.FoodType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Table(name="food")
@Getter
@Setter
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Foods {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    Long foodId;  // ID món ăn (khóa chính, tự tăng)

    String name;  // Tên món ăn / combo
    @Lob
    String description;  // Mô tả chi tiết món ăn
    BigDecimal price;  // Giá bán của món ăn
    String imageUrl;  // Đường dẫn hình ảnh minh họa món ăn
    Boolean isCombo;  // Có phải combo hay không (true = combo, false = món lẻ)
    Integer stockQuantity;  // Số lượng tồn kho hiện tại

    @Enumerated(EnumType.STRING)
    FoodType foodType;  // Loại món ăn (nước uống, bắp rang, combo,...)

    @Enumerated(EnumType.STRING)
    FoodStatus foodStatus;  // Trạng thái món ăn (đang bán, ngừng bán,...)
}

