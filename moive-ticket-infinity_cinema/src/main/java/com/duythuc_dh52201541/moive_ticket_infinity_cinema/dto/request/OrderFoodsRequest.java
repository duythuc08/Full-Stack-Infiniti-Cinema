package com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderFoodsRequest {
    Long foodId;
    Integer quantity;
}
