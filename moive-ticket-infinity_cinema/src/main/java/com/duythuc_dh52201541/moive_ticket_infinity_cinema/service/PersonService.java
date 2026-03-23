package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.PersonRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.PersonResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Person;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.PersonMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.PersonRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class PersonService {

    private final PersonRepository personRepository;
    private PersonMapper personMapper;

    public PersonService(PersonRepository personRepository, PersonMapper personMapper) {
        this.personRepository = personRepository;
        this.personMapper = personMapper;
    }

    @PreAuthorize("hasRole('ADMIN')")
    public PersonResponse createPerson(PersonRequest request) {
        if (personRepository.existsByNameAndMovieRole((request.getName()), request.getMovieRole())) {
            throw new AppException(ErrorCode.PERSON_EXISTED);
        }
        Person person = personMapper.toPerson(request);
        return personMapper.toPersonResponse(personRepository.save(person));
    }
    // ✅ Thêm nhiều người một lúc
    @PreAuthorize("hasRole('ADMIN')")
    public List<PersonResponse> createPersons(List<PersonRequest> requests) {
        return requests.stream()
                .map(request -> {
                    if (personRepository.existsByNameAndMovieRole((request.getName()), request.getMovieRole())) {
                        throw new AppException(ErrorCode.PERSON_EXISTED);
                    }
                    Person person = personMapper.toPerson(request);
                    System.out.println("ROLE = " + person.getMovieRole());
                    return personMapper.toPersonResponse(personRepository.save(person));
                })
                .toList();
    }
    @PreAuthorize("hasRole('ADMIN')")
    public List<PersonResponse> getAllPersons() {
        return personRepository.findAll()
                .stream()
                .map(personMapper:: toPersonResponse)
                .toList();
    }
}
