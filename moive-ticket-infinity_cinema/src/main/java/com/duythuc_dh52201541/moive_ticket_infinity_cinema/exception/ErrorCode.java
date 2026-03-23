package com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(999,"erorr", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1000,"Message invalid key",HttpStatus.BAD_REQUEST),
    USER_EXISTED(1001,"User existed",HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1002,"Email existed",HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1003,"User Not Found",HttpStatus.BAD_REQUEST),
    INVALID_OTP(1004,"Message invalid otp",HttpStatus.BAD_REQUEST),
    OTP_EXPIRED(1005,"OTP is expired",HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1006,"User must be at least {min} characters",HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1007,"Password must be at least {min} characters",HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1008,"User not existed",HttpStatus.NOT_FOUND),
    AUTHENTICATED(1009,"Authenticated",HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1010,"You do not have permission",HttpStatus.FORBIDDEN),
    INVALID_DOB(1011,"Your age must be at least {min}",HttpStatus.BAD_REQUEST),
    OTP_NOT_FOUND(1012,"OTP Not Found",HttpStatus.BAD_REQUEST),
    OTP_RESEND_TOO_SOON(1012,"Please wait for 30 second before resend OTP",HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1009,"Unauthenticated",HttpStatus.UNAUTHORIZED),
    OTP_NOT_VERIFIED(1013,"OTP is not verified",HttpStatus.BAD_REQUEST),
    GENRE_NOT_FOUND(1014,"Genre not found",HttpStatus.NOT_FOUND),
    GENRE_EXISTED(1015,"Genre existed",HttpStatus.BAD_REQUEST),
    MOVIE_NOT_FOUND(1016,"Movie not found",HttpStatus.NOT_FOUND),
    MOVIE_EXISTED(1017,"Movie existed",HttpStatus.BAD_REQUEST),
    PERSON_NOT_FOUND(1018,"Person not found",HttpStatus.NOT_FOUND),
    PERSON_EXISTED(1019,"Person existed",HttpStatus.BAD_REQUEST),
    BANNER_NOT_FOUND(1020,"Banner not found",HttpStatus.NOT_FOUND),
    BANNER_EXISTED(1021,"Banner existed",HttpStatus.BAD_REQUEST),
    EVENT_NOT_FOUND(1022,"Event not found",HttpStatus.NOT_FOUND),
    EVENT_EXISTED(1023,"Event existed",HttpStatus.BAD_REQUEST),
    MOVIE_ID_REQUIRED(1024,"Movie Id is required",HttpStatus.BAD_REQUEST),
    EVENT_ID_NOT_ALLOWED(1025,"Event Id is not allowed",HttpStatus.BAD_REQUEST),
    EVENT_ID_REQUIRED(1026,"Event Id is required",HttpStatus.BAD_REQUEST),
    MOVIE_ID_NOT_ALLOWED(1027,"Movie Id is not allowed",HttpStatus.BAD_REQUEST),
    BANNER_TYPE_INVALID(1028,"Banner type is invalid",HttpStatus.BAD_REQUEST),
    CINEMA_EXISTED(1029,"Cinema existed",HttpStatus.BAD_REQUEST),
    CINEMA_NOT_FOUND(1030,"Cinema not found",HttpStatus.NOT_FOUND),
    ROOM_EXISTED(1031,"Room existed",HttpStatus.BAD_REQUEST),
    ROOM_NOT_FOUND(1032,"Room not found",HttpStatus.NOT_FOUND),
    SEAT_EXISTED(1033,"Seat existed",HttpStatus.BAD_REQUEST),
    SEAT_NOT_FOUND(1034,"Seat Not Found",HttpStatus.NOT_FOUND),
    SHOWTIME_EXISTED(1035,"Show Time existed",HttpStatus.BAD_REQUEST),
    SHOWTIME_NOT_FOUND(1036,"Show Time not found",HttpStatus.NOT_FOUND),
    SEAT_SHOWTIME_EXISTED(1037,"Seat Show Time existed",HttpStatus.BAD_REQUEST),
    SEAT_SHOWTIME_NOT_FOUND(1038,"Seat Show Time not found",HttpStatus.NOT_FOUND),
    SHOWTIME_PRICE_EXISTED(1039,"Show Time price existed",HttpStatus.BAD_REQUEST),
    SHOWTIME_PRICE_NOT_FOUND(1040,"Show Time price not found",HttpStatus.NOT_FOUND),
    FOOD_EXISTED(1041,"Food existed",HttpStatus.BAD_REQUEST),
    FOOD_NOT_FOUND(1042,"Food not found",HttpStatus.NOT_FOUND),
    PROMOTION_EXISTED(1043,"Promotion existed",HttpStatus.BAD_REQUEST),
    PROMOTION_NOT_FOUND(1044,"Promotion not found",HttpStatus.NOT_FOUND),
    PROMOTION_EXPIRED(1045,"Promotion expired",HttpStatus.BAD_REQUEST),
    PROMOTION_OUT_OF_STOCK(1046,"Promotion out of stock",HttpStatus.BAD_REQUEST),
    PROMOTION_CONDITION_NOT_MET(1047,"Promotion condition not met",HttpStatus.BAD_REQUEST),
    ORDER_EXISTED(1048,"Order existed",HttpStatus.BAD_REQUEST),
    ORDER_NOT_FOUND(1049,"Order not found",HttpStatus.NOT_FOUND),
    INVALID_SEAT_SELECTION(1050,"Invalid seat selection",HttpStatus.BAD_REQUEST),
    INVALID_FOOD_SELECTION(1051,"Invalid food selection",HttpStatus.BAD_REQUEST),
    SEAT_ALREADY_BOOKED(1052,"Seat already booked",HttpStatus.BAD_REQUEST),
    INVALID_SEAT_DATA(1053,"Invalid seat data",HttpStatus.BAD_REQUEST),
    PRICE_NOT_FOUND(1054,"Price not found",HttpStatus.NOT_FOUND),;
    // Constructor để gán giá trị cho từng phần tử enum
    ErrorCode(int code, String message,HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
    private int code;
    private String message;
    private HttpStatusCode statusCode;

}
