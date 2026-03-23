package com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Users;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.VerificationToken;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken,String> {

    Optional<VerificationToken> findByVerificationCode(String verificationCode);
    Optional<VerificationToken> findByUser(Users user);
    Optional<VerificationToken> findByUserAndVerificationCode(Users user, String verificationCode);

    void deleteByUser(Users user);
}
