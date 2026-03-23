package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.BannerRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.BannerResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Banner;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Event;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Movies;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.enums.BannerType;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.BannerMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.BannerRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.EventRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.GenreRepository;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.MovieRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class BannerService {
    BannerRepository bannerRepository;
    BannerMapper bannerMapper;

    final MovieRepository movieRepository;
    final EventRepository eventRepository;

    public BannerResponse createBanner(BannerRequest request) {
        // 1) Title duy nhất
        if (bannerRepository.existsByTitle(request.getTitle())) {
            throw new AppException(ErrorCode.BANNER_EXISTED);
        }

        // 2) Ràng buộc loại và id
        if (request.getBannerType() == BannerType.MOVIE) {
            if (request.getMovieId() == null) {
                throw new AppException(ErrorCode.MOVIE_ID_REQUIRED);
            }
            if (!movieRepository.existsByMovieId(request.getMovieId())) {
                throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
            }
            if (request.getEventId() != null) {
                throw new AppException(ErrorCode.EVENT_ID_NOT_ALLOWED);
            }
        } else if (request.getBannerType() == BannerType.EVENT) {
            if (request.getEventId() == null) {
                throw new AppException(ErrorCode.EVENT_ID_REQUIRED);
            }
            if (!eventRepository.existsByEventId(request.getEventId())) {
                throw new AppException(ErrorCode.EVENT_NOT_FOUND);
            }
            if (request.getMovieId() != null) {
                throw new AppException(ErrorCode.MOVIE_ID_NOT_ALLOWED);
            }
        } else {
            throw new AppException(ErrorCode.BANNER_TYPE_INVALID);
        }

        // 3) Kiểm tra priority, URL, độ dài… (tùy yêu cầu)
        // validatePriority(request.getPriority());
        // validateUrl(request.getImageUrl()); validateUrl(request.getLinkUrl());
        // validateLength(request.getTitle(), request.getDescription());

        // 4) Map + set entity liên kết đúng cách
        Banner banner = bannerMapper.toBanner(request);
        if (request.getMovieId() != null) {
            Movies movie = movieRepository.findByMovieId(request.getMovieId())
                    .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
            banner.setMovies(movie);
        }

        if (request.getEventId() != null) {
            Event event = eventRepository.findByEventId(request.getEventId())
                    .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));
            banner.setEvent(event);
        }

        return bannerMapper.toBannerResponse(bannerRepository.save(banner));

    }

    public List<BannerResponse> createBanners(List<BannerRequest> requests) {
        return requests.stream()
                .map(request -> {

                    // 1) Title duy nhất
                    if (bannerRepository.existsByTitle(request.getTitle())) {
                        throw new AppException(ErrorCode.BANNER_EXISTED);
                    }

                    // 2) Ràng buộc loại và id
                    if (request.getBannerType() == BannerType.MOVIE) {
                        if (request.getMovieId() == null) {
                            throw new AppException(ErrorCode.MOVIE_ID_REQUIRED);
                        }
                        if (!movieRepository.existsByMovieId(request.getMovieId())) {
                            throw new AppException(ErrorCode.MOVIE_NOT_FOUND);
                        }
                        if (request.getEventId() != null) {
                            throw new AppException(ErrorCode.EVENT_ID_NOT_ALLOWED);
                        }
                    } else if (request.getBannerType() == BannerType.EVENT) {
                        if (request.getEventId() == null) {
                            throw new AppException(ErrorCode.EVENT_ID_REQUIRED);
                        }
                        if (!eventRepository.existsByEventId(request.getEventId())) {
                            throw new AppException(ErrorCode.EVENT_NOT_FOUND);
                        }
                        if (request.getMovieId() != null) {
                            throw new AppException(ErrorCode.MOVIE_ID_NOT_ALLOWED);
                        }
                    } else {
                        throw new AppException(ErrorCode.BANNER_TYPE_INVALID);
                    }
                    Banner banner = bannerMapper.toBanner(request);
                    if (request.getMovieId() != null) {
                        Movies movie = movieRepository.findByMovieId(request.getMovieId())
                                .orElseThrow(() -> new AppException(ErrorCode.MOVIE_NOT_FOUND));
                        banner.setMovies(movie);
                    }

                    if (request.getEventId() != null) {
                        Event event = eventRepository.findByEventId(request.getEventId())
                                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));
                        banner.setEvent(event);
                    }
                    log.info("Create banner" + banner.getMovies().getMovieId() + "," + banner.getMovies().getTitle());
                    return bannerMapper.toBannerResponse(bannerRepository.save(banner));
                })
                .toList();
    }

    public List<BannerResponse> getBanners(){
        return bannerRepository.findAllByOrderByPriorityAsc()
                .stream()
                .map(bannerMapper :: toBannerResponse)
                .toList();
    }

    public List<BannerResponse> getBannersByActive(){
        return bannerRepository.findByActiveTrueOrderByPriorityAsc()
                .stream()
                .map(bannerMapper :: toBannerResponse)
                .toList();
    }

    public BannerResponse getBannerByMovieId(Long movieId){
        Banner banner = bannerRepository.findByMovies_MovieId(movieId);
        if(banner == null){
            throw new AppException(ErrorCode.BANNER_NOT_FOUND);
        }
        return bannerMapper.toBannerResponse(banner);
    }
}
