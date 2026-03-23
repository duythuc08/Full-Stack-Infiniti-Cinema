package com.duythuc_dh52201541.moive_ticket_infinity_cinema.configuration;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Users;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Role;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.Roles;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.RoleRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;


import java.util.HashSet;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class ApplicationConfig {
    private PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        return args -> {
            if (userRepository.findByUsername("admin@gmail.com").isEmpty()){

                roleRepository.save(Role.builder()
                        .name(Roles.USER.name())
                        .description("User_role")
                        .build());

                Role adminRole = roleRepository.save(Role.builder()
                        .name(Roles.ADMIN.name())
                        .description("Admin_role")
                        .build());
                var roles = new HashSet<Role>();
                roles.add(adminRole);

                Users user = Users.builder()
                        .username("admin@gmail.com")
                        .password(passwordEncoder.encode("admin"))
                        .enabled(true)
                        .role(roles)
                        .build();
                userRepository.save(user);
                log.warn("admin user has been created with default password: admin, please change it");
            }

        };
    }
}
