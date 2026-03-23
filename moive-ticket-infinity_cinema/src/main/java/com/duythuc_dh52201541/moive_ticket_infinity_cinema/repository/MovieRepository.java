package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movies,String> {
    boolean existsByTitle(String title);

    boolean existsByMovieId(Long movieId);
    List<Movies> findByMovieStatus(MovieStatus movieStatus);

    Optional<Movies> findByMovieId(Long id);

    List<Movies> findByTitleContainingIgnoreCase(String keyword);
}
