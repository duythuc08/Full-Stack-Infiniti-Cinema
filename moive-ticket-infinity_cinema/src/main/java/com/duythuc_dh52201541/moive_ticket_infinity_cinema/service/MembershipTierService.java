package com.duythuc_dh52201541.moive_ticket_infinity_cinema.service;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.MembershipTierResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.MembershipTier;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper.MembershipTierMapper;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.repository.MembershipTierRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal = true)
public class MembershipTierService {
    MembershipTierRepository membershipTierRepository;
    MembershipTierMapper membershipTierMapper;
    public MembershipTierResponse getMembershipTierByName(String name){
        MembershipTier tier = membershipTierRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Lỗi hệ thống: Chưa cấu hình hạng thành viên mặc định"));;
        return membershipTierMapper.toMembershipTierResponse(tier);
    }
    public List<MembershipTierResponse> getMembershipTierList(){
        return membershipTierRepository.findAll().stream()
                .map(membershipTierMapper::toMembershipTierResponse)
                .toList();
    }
}
