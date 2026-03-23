package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Event;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.BannerType;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua field null khi trả về JSON
public class BannerRequest {
    private String imageUrl;     // ảnh banner
    private String title;        // tiêu đề ngắn
    private String description;  // mô tả thêm
    private String linkUrl;      // link chi tiết (phim hoặc sự kiện)
    private Integer priority;    // thứ tự hiển thị
    private Boolean active;      // trạng thái

    private Long movieId;        // nếu banner gắn với phim
    private Long eventId;        // nếu banner gắn với sự kiện

    private BannerType bannerType;     // MOVIE, EVENT, ADVERTISEMENT
}
