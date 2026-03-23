package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Foods;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.FoodMapper;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FoodRepository extends JpaRepository<Foods, String> {
    boolean existsByName(String name);

    Optional<Foods> findByFoodId(Long foodId);
}
