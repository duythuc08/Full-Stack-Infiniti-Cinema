package com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception;

public class AppException extends RuntimeException {
    // Biến này giữ thông tin mã lỗi (ErrorCode là enum hoặc class chứa code + message)
    private ErrorCode errorCode;

    // Constructor: khi tạo AppException, truyền vào ErrorCode
    // Gọi super(errorCode.getMessage()) để RuntimeException giữ luôn message của lỗi
    public AppException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    // Getter: lấy ra errorCode (để controller advice biết lỗi gì)
    public ErrorCode getErrorCode() {
        return errorCode;
    }

    // Setter: set lại errorCode nếu cần (thường ít dùng, vì errorCode nên immutable)
    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }
}
