package com.duythuc_dh52201541.moive_ticket_infinity_cinema;


import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class MoiveTicketInfinityCinemaApplication {

	public static void main(String[] args) {
		SpringApplication.run(MoiveTicketInfinityCinemaApplication.class, args);
	}
}
