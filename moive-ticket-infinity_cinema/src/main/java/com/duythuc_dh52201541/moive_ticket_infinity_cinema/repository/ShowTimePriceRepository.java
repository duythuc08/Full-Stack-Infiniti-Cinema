package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimePrice;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.ShowTimes;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowTimePriceRepository extends JpaRepository<ShowTimePrice, String> {

    boolean existsByShowtimes_ShowTimeIdAndSeatType(Long showtimesShowTimeId, SeatType seatType);

    List<ShowTimePrice> findByShowtimes_ShowTimeId(Long ShowTimeId);

    // Lấy giá cụ thể cho 1 loại ghế trong suất chiếu
    // SQL column: seat_type enum('COUPLE','STANDARD','VIP')
    Optional<ShowTimePrice> findByShowtimes_ShowTimeIdAndSeatType(Long showTimeId, SeatType seatType);
}