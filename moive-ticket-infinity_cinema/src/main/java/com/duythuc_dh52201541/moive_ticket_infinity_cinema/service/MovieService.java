package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.MovieCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.AdminMovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.MovieResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Genre;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Person;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.MovieStatus;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.MovieMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.GenreRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.MovieRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.PersonRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.PagedMovieResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MovieService {
    MovieRepository movieRepository;
    MovieMapper movieMapper;
    private final GenreRepository genreRepository;
    private final PersonRepository personRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public MovieResponse createMovie(MovieCreationRequest request){
        if(movieRepository.existsByTitle(request.getTitle())){
            throw new AppException(ErrorCode.MOVIE_EXISTED);
        }
        Movies movie = movieMapper.toMovies(request);

        // Convert genreNames -> Genre entities
        Set<Genre> genres = request.getGenreName().stream()
                .map(name -> genreRepository.findByName(name)
                        .orElseThrow(() -> new AppException(ErrorCode.GENRE_NOT_FOUND)))
                .collect(Collectors.toSet());
        movie.setGenre(genres);

        // Convert castIds -> Person entities
        Set<Person> castPersons = request.getCastIds().stream()
                .map(id -> personRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.PERSON_NOT_FOUND)))
                .collect(Collectors.toSet());
        movie.setCastPersons(castPersons);

        // Convert directorIds -> Person entities
        Set<Person> directors = request.getDirectorIds().stream()
                .map(id -> personRepository.findById(id)
                        .orElseThrow(() -> new AppException(ErrorCode.PERSON_NOT_FOUND)))
                .collect(Collectors.toSet());
        movie.setDirectors(directors);

        movie.setCreatedAt(LocalDateTime.now());

        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }
    @PreAuthorize("hasRole('ADMIN')")
    public List<AdminMovieResponse> getAdminMovies(){
        return movieRepository.findAll()
                .stream()
                .map(movieMapper::toAdminMovieResponse)
                .toList();
    }
    public MovieResponse getMovieById(Long movieId) {
        Movies movie = movieRepository.findByMovieId(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + movieId));
        return movieMapper.toMovieResponse(movie);
    }
    public List<MovieResponse> getMovies(){
        return movieRepository.findAll()
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    public List<MovieResponse> getMoviesShowing(){
        return movieRepository.findByMovieStatus(MovieStatus.NOW_SHOWING)
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }
    public List<MovieResponse> getMoviesComingSoon(){
        return movieRepository.findByMovieStatus(MovieStatus.COMING_SOON)
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }
    public List<MovieResponse> getMoviesImax(){
        return movieRepository.findByMovieStatus(MovieStatus.IMAX)
                .stream()
                .map(movieMapper::toMovieResponse)
                .toList();
    }

    // ─── Paginated variants (hỗ trợ ?page=0&size=4 từ FE) ─────
    public List<MovieResponse> getMoviesShowingPaged(int page, int size) {
        return movieRepository.findByMovieStatus(
                MovieStatus.NOW_SHOWING,
                PageRequest.of(page, size, Sort.by("movieId").descending()))
                .getContent().stream().map(movieMapper::toMovieResponse).toList();
    }

    public List<MovieResponse> getMoviesComingSoonPaged(int page, int size) {
        return movieRepository.findByMovieStatus(
                MovieStatus.COMING_SOON,
                PageRequest.of(page, size, Sort.by("movieId").descending()))
                .getContent().stream().map(movieMapper::toMovieResponse).toList();
    }

    public List<MovieResponse> getMoviesImaxPaged(int page, int size) {
        return movieRepository.findByMovieStatus(
                MovieStatus.IMAX,
                PageRequest.of(page, size, Sort.by("movieId").descending()))
                .getContent().stream().map(movieMapper::toMovieResponse).toList();
    }

    // ─── PagedMovieResponse variants (trả về metadata để FE biết totalPages) ───

    private PagedMovieResponse buildPagedResponse(MovieStatus status, int page, int size) {
        Page<Movies> result = movieRepository.findByMovieStatus(
                status, PageRequest.of(page, size, Sort.by("movieId").descending()));
        return PagedMovieResponse.builder()
                .content(result.getContent().stream().map(movieMapper::toMovieResponse).toList())
                .currentPage(page)
                .pageSize(size)
                .totalPages(result.getTotalPages())
                .totalElements(result.getTotalElements())
                .build();
    }

    public PagedMovieResponse getShowingMoviesPagedResponse(int page, int size) {
        return buildPagedResponse(MovieStatus.NOW_SHOWING, page, size);
    }

    public PagedMovieResponse getComingSoonMoviesPagedResponse(int page, int size) {
        return buildPagedResponse(MovieStatus.COMING_SOON, page, size);
    }

    public PagedMovieResponse getImaxMoviesPagedResponse(int page, int size) {
        return buildPagedResponse(MovieStatus.IMAX, page, size);
    }

}
