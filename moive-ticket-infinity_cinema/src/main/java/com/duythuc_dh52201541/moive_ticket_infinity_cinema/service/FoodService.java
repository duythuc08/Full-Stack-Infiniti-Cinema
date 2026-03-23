package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.FoodRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.FoodResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Foods;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.AppException;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.exception.ErrorCode;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.FoodMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.FoodRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class FoodService {
    FoodRepository foodRepository;
    FoodMapper  foodMapper;

    @PreAuthorize("hasRole('ADMIN')")
    public FoodResponse createFood(FoodRequest foodRequest) {
        if (foodRepository.existsByName(foodRequest.getName())) {
            throw new AppException(ErrorCode.FOOD_EXISTED);
        }
        Foods foods = foodMapper.toFoods(foodRequest);
        return foodMapper.toFoodResponse(foodRepository.save(foods));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<FoodResponse> createFoods(List<FoodRequest> foodRequests) {
        return foodRequests.stream()
                .map(this::createFood)
                .toList();
    }

    public List<FoodResponse> getAllFoods() {
        return foodRepository.findAll()
                .stream()
                .map(foodMapper::toFoodResponse)
                .toList();
    }

    public FoodResponse getFoodById(Long foodId) {
        Foods foods = foodRepository.findByFoodId(foodId)
                .orElseThrow(() ->  new AppException(ErrorCode.FOOD_NOT_FOUND));
        return foodMapper.toFoodResponse(foods);
    }
}
