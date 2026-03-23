package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieRole;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua field null khi trả về JSON
public class PersonRequest {
    private String name;        // Tên diễn viên/đạo diễn
    private String avatarUrl;   // Ảnh đại diện (nếu có)
    private MovieRole movieRole; // ACTOR hoặc DIRECTOR
}

