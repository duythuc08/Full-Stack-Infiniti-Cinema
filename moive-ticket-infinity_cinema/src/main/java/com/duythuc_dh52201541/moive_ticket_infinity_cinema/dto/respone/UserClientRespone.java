package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data // Lombok: sinh getter, setter, toString, equals, hashCode
@NoArgsConstructor // Lombok: sinh constructor không tham số
@AllArgsConstructor // Lombok: sinh constructor có tham số cho tất cả field
@Builder // Lombok: hỗ trợ tạo object theo Builder pattern
@FieldDefaults(level = AccessLevel.PRIVATE) // Lombok: mặc định tất cả field là private
@JsonInclude(JsonInclude.Include.NON_NULL) // Bỏ qua field null khi trả về JSON
public class UserClientRespone {

    String userId;
    String username; //su dung email
    String password;
    String firstname;
    String lastname;
    String phoneNumber;
    LocalDate birthday;
    int loyaltyPoints;
    String memberShipTierName;
}
