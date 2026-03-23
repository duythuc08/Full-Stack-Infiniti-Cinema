package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.*;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.*;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.AuthenticationService;
import com.nimbusds.jose.JOSEException;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

/*
    Xử lý đăng nhập (login)
Nhận username + password từ client (qua @PostMapping("/login")).
Xác thực thông tin (gọi AuthenticationManager hoặc tự viết logic check trong DB).
Nếu đúng → trả về JWT token hoặc session.
Nếu sai → ném exception (ví dụ: BadCredentialsException).
    Xử lý đăng ký (signup)
Nhận thông tin đăng ký (qua @PostMapping("/register")).
Gọi UserService để lưu user mới (mật khẩu phải mã hóa bằng PasswordEncoder trước khi lưu).
Có thể thêm các API khác liên quan đến auth
refresh-token (cấp lại token mới).
logout (xóa token khỏi client hoặc invalidate session).
me (lấy thông tin user hiện tại dựa trên token).*/
@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> authenticate(@RequestBody IntrospectResquest resquest) throws ParseException, JOSEException {
        var result = authenticationService.introspect(resquest);
        return ApiResponse.<IntrospectResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/login")
    ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationResquest resquest){
        var result = authenticationService.authenticate(resquest);
        return ApiResponse.<AuthenticationResponse>builder()
                .result(result)
                .build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutResquest request) throws ParseException, JOSEException {
        authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .message("Logout successfully!")
                .build();
    }

    @PostMapping("/register")
    public ApiResponse<UsersRespone> register(@RequestBody RegisterRequest request) {
        var result = authenticationService.register(request);
        return ApiResponse.<UsersRespone>builder()
                .result(result)
                .message("Đăng ký thành công, vui lòng kiểm tra email để xác thực")
                .build();
    }

    @PostMapping("/verify")
    public ApiResponse<Void> verifyEmail(@RequestParam("otp") String otp, @RequestParam String email) {
        authenticationService.verifyEmail(otp,email);
        return ApiResponse.<Void>builder()
                .message( "Xác thực thành công" )
                .build();

    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authenticationService.forgotPassword(request.getUsername());
        return ApiResponse.<Void>builder()
                .message("OTP đã được gửi tới email")
                .build();
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request,@RequestParam String email) {
        authenticationService.resetPassword(email, request.getNewPassword());
        return ApiResponse.<Void>builder()
                .message("Lấy mật khẩu thành công")
                .build();
    }
    @PostMapping("/resendOTP")
    public ApiResponse<Void> resendOTP(@RequestParam String email) {
        authenticationService.resendOtp(email);
        return ApiResponse.<Void>builder()
                .message("OTP mới đã được gửi, Vui lòng kiểm tra")
                .build();
    }
}
