package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.AgeRating;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua field null khi trả về JSON
public class AdminMovieResponse {
    Long movieId;
    String title;          // Tên phim
    String description;    // Mô tả nội dung phim
    Integer duration;      // Thời lượng phim (tính bằng phút)
    String posterUrl;      // Đường dẫn ảnh poster phim
    String trailerUrl;     // Đường dẫn trailer phim
    LocalDate releaseDate; // Ngày khởi chiếu
    // ✅ thay vì String cast/director
    private Set<PersonResponse> castPersons;   // danh sách diễn viên
    private Set<PersonResponse> directors;     // danh sách đạo diễn
    String language;       // Ngôn ngữ phim
    String subTitle;       // Phụ đề (nếu có)

    Set<GenreResponse> genre;      // Danh sách thể loại của phim (nhiều-nhiều)

    AgeRating ageRating;   // Phân loại độ tuổi (P, 13+, 18+,...)
    MovieStatus movieStatus;    // Trạng thái phim (Đang chiếu, Sắp chiếu,...)
    LocalDateTime createdAt; // Ngày tạo bản ghi
    LocalDateTime updatedAt; // Ngày cập nhật cuối cùng
}
