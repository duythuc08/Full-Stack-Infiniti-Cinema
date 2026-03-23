package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<Promotion,String> {
    Promotion findByPromotionId(Long promotionId);

    Optional<Promotion> findByCode(String code);


}
