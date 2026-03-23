package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.MembershipTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

public interface MembershipTierRepository extends JpaRepository<MembershipTier, String> {
    @Query("SELECT m FROM MembershipTier m ORDER BY m.pointsRequired DESC")
    List<MembershipTier> findAllOrderByPointsRequiredDesc();

    Optional<MembershipTier> findByName(String name);


}
