package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Rooms;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepository extends JpaRepository<Rooms, Long> {

    /**
     * Lấy tất cả các phòng thuộc về một Rạp.
     * @param cinemaId: ID của rạp phim.
     * (Giả sử trong entity Cinemas của bạn, khóa chính tên là 'cinemaId' hoặc 'id'.
     * Nếu là 'id', hãy đổi thành findByCinemas_Id)
     */
    List<Rooms> findByCinemas_CinemaId(Long cinemaId);
    /**
     * Lấy danh sách phòng của rạp theo một trạng thái cụ thể.
     * Dùng khi: Muốn lấy danh sách phòng AVAILABLE để xếp lịch chiếu (bỏ qua phòng đang bảo trì).
     */
    List<Rooms> findByCinemas_CinemaIdAndRoomStatus(Long cinemaId, RoomStatus roomStatus);
    /**
     * Lấy danh sách phòng theo Loại phòng (ví dụ: tìm tất cả phòng IMAX của rạp này).
     */
    List<Rooms> findByCinemas_CinemaIdAndRoomType(Long cinemaId, RoomType roomType);
    /**
     * Kiểm tra xem tên phòng đã tồn tại trong rạp này chưa.
     * Dùng khi: Admin tạo mới phòng, tránh đặt trùng tên "Room 1" hai lần trong cùng 1 rạp.
     */
    boolean existsByNameAndCinemas_CinemaId(String name, Long cinemaId);
    /**
     * Tìm phòng theo tên (có chứa từ khóa) trong một rạp cụ thể.
     * Dùng cho chức năng Search: Admin gõ "VIP" -> ra các phòng VIP của rạp đó.
     */
    List<Rooms> findByCinemas_CinemaIdAndNameContainingIgnoreCase(Long cinemaId, String keyword);

    Optional<Rooms> findByRoomId(Long roomId);

}