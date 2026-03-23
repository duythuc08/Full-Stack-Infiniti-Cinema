package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Cinemas;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.CinemaStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CinemaRepository extends JpaRepository<Cinemas,String> {
    boolean existsByName(String name);

    List<Cinemas> findByCinemaStatus(CinemaStatus status);

    Optional<Cinemas> findByCinemaId(Long cinemaId);
    List<Cinemas> findByNameContainingIgnoreCase(String name);
}
