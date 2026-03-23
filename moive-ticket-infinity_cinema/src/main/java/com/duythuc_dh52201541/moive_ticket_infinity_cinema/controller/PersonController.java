package com.duythuc_dh52201541.moive_ticket_infinity_cinema.controller;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.PersonRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.ApiResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.PersonResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Person;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.service.PersonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/persons")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class PersonController {
    private final PersonService personService;

    // API thêm mới cast/director
    @PostMapping
    ApiResponse<PersonResponse> createPerson(@RequestBody PersonRequest personRequest) {
        return ApiResponse.<PersonResponse>builder()
                .result(personService.createPerson(personRequest))
                .message("Thêm diễn viên thành công")
                .build();
    }

    @PostMapping("/bulk")
    ApiResponse<List<PersonResponse>> createPersons(@RequestBody List<PersonRequest> requests) {
        return ApiResponse.<List<PersonResponse>>builder()
                .result(personService.createPersons(requests))
                .message("Đã thêm thành công " + requests.size())
                .build();
    }

    @GetMapping
    ApiResponse<List<PersonResponse>> getAllPersons() {
        return ApiResponse.<List<PersonResponse>>builder()
                .result(personService.getAllPersons())
                .build();
    }

}
