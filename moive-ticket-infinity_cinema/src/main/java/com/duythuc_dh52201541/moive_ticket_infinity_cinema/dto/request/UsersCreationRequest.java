package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua field null khi trả về JSON
public class UsersCreationRequest {
    @NotBlank(message = "USERNAME_REQUIRED")
    @Size(min = 3, message = "USERNAME_INVALID")
    @Email(message = "USERNAME_MUST_BE_EMAIL")
    String username;

    @Size(min = 8, message = "INVALID_PASSWORD")
    String password;

    String firstname;
    String lastname;
    String phoneNumber;
    LocalDate birthday;
}
