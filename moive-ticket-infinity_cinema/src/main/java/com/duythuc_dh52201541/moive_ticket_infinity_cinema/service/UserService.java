package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.UserUpdateRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.UsersCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UserClientRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UserMenuRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UsersRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Role;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Users;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.Roles;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.UserStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.UserMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.RoleRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class UserService {
    private final RoleRepository roleRepository;
    UserRepository userRepository;
    UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    //PasswordEncoder passwordEncoder;
    public UsersRespone createUser(UsersCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())){
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        Role role = roleRepository.save(Role.builder().name(Roles.USER.name()).build());
        var roles = new HashSet<Role>();
        roles.add(role);

        Users newUsers = userMapper.toUsers(request);
        newUsers.setPassword(passwordEncoder.encode(newUsers.getPassword()));
        newUsers.setRole(roles);
        newUsers.setUserStatus(UserStatus.ACTIVE);
        return  userMapper.toUsersRespone(userRepository.save(newUsers));
    }


    @PreAuthorize("hasRole('ADMIN')")
    public List<UsersRespone> getUsers() {
        // Lấy toàn bộ danh sách User trong DB
        return userRepository.findAll()       // 1. Truy vấn DB, lấy ra List<User>
                .stream()                     // 2. Chuyển List<User> thành Stream<User>
                .map(userMapper::toUsersRespone) // 3. Với mỗi User -> map sang UserResponse
                .toList();                    // 4. Thu thập lại thành List<UserResponse>
    }

    @PreAuthorize("hasRole('ADMIN')")
    public UsersRespone getUser(String id) {
        // Tìm user theo id, nếu không có thì ném exception
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // Map entity -> response DTO
        return userMapper.toUsersRespone(user);
    }

    /**
     * Lấy thông tin của người dùng đang đăng nhập.
     */
    public UserClientRespone getMyInfo() {
        // 1. Lấy thông tin xác thực của người dùng hiện tại
        var context = SecurityContextHolder.getContext();

        // 2. Lấy username (tên đăng nhập)
        String name = context.getAuthentication().getName();

        // 3. Tìm người dùng trong CSDL bằng username
        Users user = userRepository.findByUsername(name)
                // 4. Nếu không tìm thấy, ném lỗi
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // 5. Chuyển đổi từ Entity (Users) sang DTO (UsersRespone) để trả về
        return userMapper.toUserClientRespone(user);
    }


    public UserMenuRespone getUserMenu() {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Users user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserMenuRespone(user);
    }


    // =================== UPDATE MY INFO ===================
    public UserClientRespone updateMyInfo(UserUpdateRequest request) {
        var context = SecurityContextHolder.getContext();
        String name = context.getAuthentication().getName();
        Users user = userRepository.findByUsername(name)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (request.getFirstname() != null) user.setFirstname(request.getFirstname());
        if (request.getLastname() != null) user.setLastname(request.getLastname());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getBirthday() != null) user.setBirthday(request.getBirthday());

        return userMapper.toUserClientRespone(userRepository.save(user));
    }

    // =================== UPDATE ===================
    @PreAuthorize("#userId == authentication.name or hasAuthority('ADMIN')")
    public UsersRespone updateUser(String userId, UserUpdateRequest request) {
        // 1️ Lấy user theo id từ DB (nếu không tồn tại thì ném exception USER_NOT_FOUND)
        Users newUser = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 2️ Dùng mapper để cập nhật các field từ request -> user entity
        userMapper.updateUser(newUser, request);

        // 3 Mã hóa password mới từ request rồi set lại cho user
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));

        // 4️ Lấy danh sách Role từ DB theo list id trong request
        var roles = roleRepository.findAllById(request.getRoles());
        newUser.setRole(new HashSet<>(roles));

        // 5️ Lưu user đã update vào DB rồi map sang DTO trả về
        return userMapper.toUsersRespone(userRepository.save(newUser));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        // Xoá user theo id trong DB
        userRepository.deleteById(userId);
    }
}
