package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimePrice;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.ShowTimeStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.Set;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class ShowTimeRequest {
    LocalDateTime startTime;
    LocalDateTime endTime;

    Long movieId;
    Long roomId;

    // Giá vé có thể nhận list object nhỏ hoặc xử lý sau, tạm thời giữ nguyên nếu logic bạn cần
    // Set<ShowTimePriceRequest> prices;

    @Enumerated(EnumType.STRING)
    ShowTimeStatus showTimeStatus;
}
