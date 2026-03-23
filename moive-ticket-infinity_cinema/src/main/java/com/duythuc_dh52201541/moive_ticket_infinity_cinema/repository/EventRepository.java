package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface EventRepository extends JpaRepository<Event, String> {
    boolean existsByEventId(Long eventId);

    Optional<Event> findByEventId(Long id);
}
