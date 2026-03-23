//package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;
//
//import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
//import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Person;
//import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieRole;
//import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.MovieRepository;
//import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.PersonRepository;
//import jakarta.transaction.Transactional;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class DataMigrationService {
//
//    private final MovieRepository movieRepository;
//    private final PersonRepository personRepository;
//
//    public DataMigrationService(MovieRepository movieRepository, PersonRepository personRepository) {
//        this.movieRepository = movieRepository;
//        this.personRepository = personRepository;
//    }
//
//    @Transactional
//    public void migrateCastAndDirectors() {
//        List<Movies> movies = movieRepository.findAll();
//
//        for (Movies movie : movies) {
//            // Xử lý cast
//            if (movie.getCast() != null) {
//                String[] castNames = movie.getCast().split(",");
//                for (String name : castNames) {
//                    String trimmedName = name.trim();
//                    Person actor = personRepository.findByName(trimmedName)
//                            .orElseGet(() -> personRepository.save(
//                                    Person.builder()
//                                            .name(trimmedName)
//                                            .movieRole(MovieRole.ACTOR)
//                                            .build()
//                            ));
//                    movie.getCastPersons().add(actor); // castPersons là Set<Person> mới
//                }
//            }
//
//            // Xử lý director
//            if (movie.getDirector() != null) {
//                String[] directorNames = movie.getDirector().split(",");
//                for (String name : directorNames) {
//                    String trimmedName = name.trim();
//                    Person director = personRepository.findByName(trimmedName)
//                            .orElseGet(() -> personRepository.save(
//                                    Person.builder()
//                                            .name(trimmedName)
//                                            .movieRole(MovieRole.DIRECTOR)
//                                            .build()
//                            ));
//                    movie.getDirectors().add(director); // directors là Set<Person> mới
//                }
//            }
//
//            movieRepository.save(movie);
//        }
//    }
//}
//
