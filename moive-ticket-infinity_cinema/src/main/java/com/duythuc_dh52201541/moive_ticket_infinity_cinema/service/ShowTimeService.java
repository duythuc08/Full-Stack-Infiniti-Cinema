package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.ShowTimeRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ShowTimeResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.ShowTimeStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.ShowTimeMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.MovieRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.RoomRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.SeatShowTimeRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.ShowTimeRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ShowTimeService {
    ShowTimeRepository showTimeRepository;
    ShowTimeMapper showTimeMapper;
    // Cần thêm 2 Repository này để tìm kiếm
    private final MovieRepository movieRepository;
    private final RoomRepository roomRepository;
    private final SeatShowTimeRepository seatShowTimeRepository;

    @Transactional // QUAN TRỌNG: Đảm bảo tạo Showtime + Tạo Ghế thành công cùng lúc
    @PreAuthorize("hasRole('ADMIN')")
    public ShowTimeResponse createShowTime(ShowTimeRequest request) {

        // Validate room
        Rooms room = roomRepository.findByRoomId(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));


        // Validate movie
        Movies movie = movieRepository.findByMovieId(request.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Check conflict
        if (showTimeRepository.existsConflictingShowtime(
                request.getRoomId(),
                request.getStartTime(),
                request.getEndTime())) {
            throw new AppException(ErrorCode.SHOWTIME_EXISTED);
        }

        // Convert
        ShowTimes showTimes = showTimeMapper.toShowTimes(request);

        // MUST SET — Mapper không set cho bạn
        showTimes.setRooms(room);
        showTimes.setMovies(movie);

        // Save
        ShowTimes savedShowTime = showTimeRepository.save(showTimes);

        // Generate seat-showtime
        seatShowTimeRepository.bulkInsertSeatsForShowTime(
                savedShowTime.getShowTimeId(),
                request.getRoomId()
        );

        return showTimeMapper.toShowTimeResponse(savedShowTime);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<ShowTimeResponse> createShowTimes(List<ShowTimeRequest> requests) {
        return requests.stream()
                .map(this::createShowTime) // Tận dụng lại hàm createShowTime ở trên để code gọn hơn
                .toList();
    }

    public List<ShowTimeResponse> getAllShowTimes() {
        return showTimeRepository.findAllWithDetails()
                .stream()
                .map(showTimeMapper::toShowTimeResponse)
                .toList();
    }

    // 1. Lấy suất chiếu của một phim trong khoảng thời gian
    public List<ShowTimeResponse> getShowTimesByMovieAndTimeRange(Long movieId, LocalDateTime start, LocalDateTime end) {
        // Lưu ý: Kiểm tra lại tên biến trong Entity là 'movies' hay 'movie'
        return showTimeRepository.findByMovies_MovieIdAndStartTimeBetween(movieId, start, end)
                .stream()
                .map(showTimeMapper::toShowTimeResponse)
                .toList();
    }

    // 2. Lấy lịch chiếu của một phim tại một rạp cụ thể
    public List<ShowTimeResponse> getShowTimesByCinemaAndMovie(Long cinemaId, Long movieId, LocalDateTime now) {
        return showTimeRepository.findByRooms_Cinemas_CinemaIdAndMovies_MovieIdAndStartTimeAfter(cinemaId, movieId, now)
                .stream()
                .map(showTimeMapper::toShowTimeResponse)
                .toList();
    }

    // 3. Lấy suất chiếu active (Fix tên biến roomId -> movieId cho đúng logic)
    public List<ShowTimeResponse> getActiveShowTimesByMovieAndRange(Long movieId, LocalDateTime start, LocalDateTime end) {
        return showTimeRepository.findByMovies_MovieIdAndStartTimeBetweenAndShowTimeStatusNot(movieId, start, end, ShowTimeStatus.CANCELLED)
                .stream()
                .sorted(Comparator.comparing(ShowTimes::getStartTime))
                .map(showTimeMapper::toShowTimeResponse)
                .toList();
    }

    // 4. Lấy tất cả suất chiếu theo phim
    public List<ShowTimeResponse> getShowTimesByMovie(Long movieId){
        return  showTimeRepository.findByMovies_MovieId(movieId)
                .stream()
                .map(showTimeMapper::toShowTimeResponse)
                .toList();
    }
}