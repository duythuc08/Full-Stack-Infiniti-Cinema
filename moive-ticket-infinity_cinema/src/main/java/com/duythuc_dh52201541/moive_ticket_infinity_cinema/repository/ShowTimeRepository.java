package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.ShowTimeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowTimeRepository extends JpaRepository<ShowTimes, String> {

    /**
     * Tự động clone ghế từ bảng Seat sang SeatShowTime bằng SQL thuần (Cực nhanh)
     * 1. Lấy tất cả ghế thuộc phòng của suất chiếu.
     * 2. Insert vào bảng seat_show_time.
     * 3. Set trạng thái bán vé (seat_show_time_status) là 'AVAILABLE'.
     * 4. Copy trạng thái vật lý (seat_status) từ ghế gốc (để biết ghế nào đang bảo trì).
     */


    // Tương tự cho hàm lấy tất cả (thay thế findAll)
    @Query("SELECT s FROM ShowTimes s " +
            "LEFT JOIN FETCH s.movies " +
            "LEFT JOIN FETCH s.rooms r " +
            "LEFT JOIN FETCH r.cinemas")
    List<ShowTimes> findAllWithDetails();


    List<ShowTimes> findByMovies_MovieIdAndStartTimeBetween(Long movieId, LocalDateTime startTime, LocalDateTime endTime);

    // Cách viết Query thuần để tránh lỗi JPA naming convention (Recommended)
    @Query("SELECT s FROM ShowTimes s " +
            "WHERE s.rooms.cinemas.cinemaId = :cinemaId " +
            "AND s.movies.movieId = :movieId " +
            "AND s.startTime > :now")
    List<ShowTimes> findByRooms_Cinemas_CinemaIdAndMovies_MovieIdAndStartTimeAfter(
            @Param("cinemaId") Long cinemaId,
            @Param("movieId") Long movieId,
            @Param("now") LocalDateTime now);


    List<ShowTimes> findByMovies_MovieIdAndStartTimeBetweenAndShowTimeStatusNot(
            Long movieId,
            LocalDateTime start,
            LocalDateTime end,
            ShowTimeStatus status
    );

    @Query("SELECT CASE WHEN COUNT(s) > 0 THEN true ELSE false END " +
            "FROM ShowTimes s " +
            "WHERE s.rooms.roomId = :roomId " +
            "AND s.showTimeStatus != 'CANCELLED' " +
            "AND (:newItemStart < s.endTime AND :newItemEnd > s.startTime)")
    boolean existsConflictingShowtime(@Param("roomId") Long roomId,
                                      @Param("newItemStart") LocalDateTime newItemStart,
                                      @Param("newItemEnd") LocalDateTime newItemEnd);

    List<ShowTimes> findByMovies_MovieId(Long movieId);

    boolean existsByShowTimeId(Long showTimeId);

    // Quick Booking Bar: lấy danh sách phim tại rạp
    // Hiển thị phim có status NOW_SHOWING/IMAX (bất kể thời gian suất chiếu)
    // HOẶC phim có suất chiếu từ đầu ngày hôm nay trở đi
    @Query("SELECT DISTINCT s.movies FROM ShowTimes s " +
            "JOIN s.rooms r JOIN r.cinemas c " +
            "WHERE c.cinemaId = :cinemaId " +
            "AND s.showTimeStatus != 'CANCELLED' " +
            "AND (s.movies.movieStatus IN :activeStatuses OR s.startTime >= :startOfToday)")
    List<Movies> findDistinctMoviesByCinemaId(
            @Param("cinemaId") Long cinemaId,
            @Param("startOfToday") LocalDateTime startOfToday,
            @Param("activeStatuses") List<MovieStatus> activeStatuses);

    // Quick Booking Bar: lấy các suất chiếu từ đầu ngày hôm nay của một phim tại rạp
    @Query("SELECT s FROM ShowTimes s " +
            "JOIN s.rooms r JOIN r.cinemas c " +
            "WHERE c.cinemaId = :cinemaId " +
            "AND s.movies.movieId = :movieId " +
            "AND s.startTime >= :startOfToday " +
            "AND s.showTimeStatus != 'CANCELLED' " +
            "ORDER BY s.startTime ASC")
    List<ShowTimes> findByCinemaIdAndMovieIdAfterNow(
            @Param("cinemaId") Long cinemaId,
            @Param("movieId") Long movieId,
            @Param("startOfToday") LocalDateTime startOfToday);

    // Quick Booking Bar: lấy suất chiếu theo rạp + phim + khoảng ngày
    @Query("SELECT s FROM ShowTimes s " +
            "JOIN s.rooms r JOIN r.cinemas c " +
            "WHERE c.cinemaId = :cinemaId " +
            "AND s.movies.movieId = :movieId " +
            "AND s.startTime >= :startOfDay " +
            "AND s.startTime <= :endOfDay " +
            "AND s.showTimeStatus != 'CANCELLED' " +
            "ORDER BY s.startTime ASC")
    List<ShowTimes> findByCinemaIdAndMovieIdOnDate(
            @Param("cinemaId") Long cinemaId,
            @Param("movieId") Long movieId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);

    // Quick Booking Bar: phim NOW_SHOWING/IMAX còn ít nhất 1 suất chưa qua (dùng cho dropdown Chọn Phim)
    @Query("SELECT DISTINCT s.movies FROM ShowTimes s " +
            "WHERE s.showTimeStatus != 'CANCELLED' " +
            "AND s.startTime >= :now " +
            "AND s.movies.movieStatus IN :activeStatuses")
    List<Movies> findNowShowingMoviesWithUpcomingSlots(
            @Param("now") LocalDateTime now,
            @Param("activeStatuses") List<MovieStatus> activeStatuses);

    // Quick Booking Bar (Movie-first): lấy danh sách rạp có suất chiếu cho một phim NOW_SHOWING
    @Query("SELECT DISTINCT r.cinemas FROM ShowTimes s " +
            "JOIN s.rooms r JOIN r.cinemas c " +
            "WHERE s.movies.movieId = :movieId " +
            "AND s.showTimeStatus != 'CANCELLED' " +
            "AND s.startTime >= :now")
    List<com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas> findDistinctCinemasByMovieId(
            @Param("movieId") Long movieId,
            @Param("now") LocalDateTime now);
}