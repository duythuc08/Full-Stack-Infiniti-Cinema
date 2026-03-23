package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

//Trung gian truyền dữ liệu
@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
public class AuthenticationResquest {
    String username;
    String password;
}
