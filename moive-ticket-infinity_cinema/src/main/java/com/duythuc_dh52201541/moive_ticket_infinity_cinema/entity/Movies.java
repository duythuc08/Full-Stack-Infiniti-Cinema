package com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.AgeRating;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="movie")
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class Movies {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long movieId;          // ID phim (khóa chính, tự tăng)

    String title;          // Tên phim
    @Lob
    String description;    // Mô tả nội dung phim
    Integer duration;      // Thời lượng phim (tính bằng phút)
    String posterUrl;      // Đường dẫn ảnh poster phim
    String trailerUrl;     // Đường dẫn trailer phim
    LocalDate releaseDate; // Ngày khởi chiếu
    String language;       // Ngôn ngữ phim
    String subTitle;       // Phụ đề (nếu có)
    @ManyToMany
    @JoinTable(
            name = "movie_cast",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private Set<Person> castPersons = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "movie_directors",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private Set<Person> directors = new HashSet<>();
    @ManyToMany
    @JoinTable(
            name = "movie_genres",
            joinColumns = @JoinColumn(name = "movie_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    Set<Genre> genre;      // Danh sách thể loại của phim (nhiều-nhiều)

    @Enumerated(EnumType.STRING)
    AgeRating ageRating;   // Phân loại độ tuổi (P, 13+, 18+,...)

    @Enumerated(EnumType.STRING)
    @Column(name = "movie_status")
    MovieStatus movieStatus;    // Trạng thái phim (Đang chiếu, Sắp chiếu,...)

    LocalDateTime createdAt; // Ngày tạo bản ghi
    LocalDateTime updatedAt; // Ngày cập nhật cuối cùng
}

