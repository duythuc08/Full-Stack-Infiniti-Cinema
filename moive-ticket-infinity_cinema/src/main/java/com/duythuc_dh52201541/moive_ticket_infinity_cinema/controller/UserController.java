package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.UserUpdateRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.UsersCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UserClientRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UserMenuRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UsersRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Users;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.UserService;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserController {
    UserService userService;

    @PostMapping
    ApiResponse<UsersRespone> createUser(@RequestBody @Valid UsersCreationRequest request){
        return ApiResponse.<UsersRespone>builder()
                .result(userService.createUser(request))
                .build();
    }

    @GetMapping
    ApiResponse<List<UsersRespone>> getUsers(){
        return ApiResponse.<List<UsersRespone>>builder()
                .result(userService.getUsers())
                .build();
    }

    @GetMapping("{userId}")
    ApiResponse<UsersRespone> getUser(@PathVariable("userId") String userId){
        return ApiResponse.<UsersRespone>builder()
                .result(userService.getUser(userId))
                .build();
    }

    @GetMapping("/myInfo")
    ApiResponse<UserClientRespone> getMyInfo(){
        return ApiResponse.<UserClientRespone>builder()
                .result(userService.getMyInfo())
                .build();
    }
    @GetMapping("/myMenu")
    ApiResponse<UserMenuRespone> getUserMenu(){
        return ApiResponse.<UserMenuRespone>builder()
                .result(userService.getUserMenu())
                .build();
    }

    // =================== UPDATE MY INFO ===================
    @PutMapping("/myInfo")
    ApiResponse<UserClientRespone> updateMyInfo(@RequestBody UserUpdateRequest request){
        return ApiResponse.<UserClientRespone>builder()
                .result(userService.updateMyInfo(request))
                .build();
    }

    // =================== UPDATE ===================
    @PutMapping("/{userId}")
    ApiResponse<UsersRespone> updateUser(@PathVariable String userId ,@RequestBody @Valid UserUpdateRequest request){
        // PUT /users/{userId}
        // Nhận dữ liệu cập nhật từ body + id từ URL
        // Gọi service để cập nhật user
        return ApiResponse.<UsersRespone>builder()
                .result(userService.updateUser(userId, request)) //Vai trò: DTO để server trả dữ liệu user về cho client sau khi update.
                .build();
    }


    @DeleteMapping("{userId}")
    ApiResponse<String> deleteUser(@PathVariable String userId){
        userService.deleteUser(userId);
        return  ApiResponse.<String>builder()
                .result("User has been deleted")
                .build();
    }
}
