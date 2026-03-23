package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.PersonRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.PersonResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Person;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieRole;
import org.mapstruct.Mapper;
import org.springframework.data.jpa.repository.JpaRepository;

@Mapper(componentModel = "spring")
public interface PersonMapper {
    Person toPerson(PersonRequest request);
    PersonResponse toPersonResponse(Person person);

}
