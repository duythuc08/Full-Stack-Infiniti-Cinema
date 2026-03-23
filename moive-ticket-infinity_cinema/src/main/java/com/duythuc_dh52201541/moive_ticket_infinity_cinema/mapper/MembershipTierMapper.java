package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;

import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.MembershipTierResponse;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.MembershipTier;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MembershipTierMapper {
    MembershipTierResponse toMembershipTierResponse(MembershipTier membershipTier);
}
