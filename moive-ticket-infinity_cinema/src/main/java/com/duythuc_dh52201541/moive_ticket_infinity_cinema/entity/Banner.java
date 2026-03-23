package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.BannerType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name="banners")
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ảnh banner hiển thị trên trang chủ
    private String imageUrl;

    // Tiêu đề ngắn (vd: "Phim hot", "Khuyến mãi 20/11")
    private String title;

    // Nội dung mô tả thêm
    private String description;

    // Link đến chi tiết (có thể là phim hoặc sự kiện)
    private String linkUrl;

    // Thứ tự hiển thị (banner nào lên trước)
    private Integer priority;

    // Trạng thái (active)
    private Boolean active;

    @Enumerated(EnumType.STRING)
    BannerType bannerType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "movie_id")
    private Movies movies;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id")
    private Event event;
}
