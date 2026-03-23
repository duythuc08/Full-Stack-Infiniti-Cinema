package com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums;

public enum ReviewStatus {
    APPROVED,  // Đã duyệt - Admin đã duyệt, hiển thị công khai
    PENDING,   // Đang chờ - Chờ admin kiểm duyệt
    REJECTED,  // Bị từ chối - Admin từ chối (spam, nội dung xấu)
    HIDDEN     // Đã ẩn - Admin ẩn bình luận (vi phạm)
}
