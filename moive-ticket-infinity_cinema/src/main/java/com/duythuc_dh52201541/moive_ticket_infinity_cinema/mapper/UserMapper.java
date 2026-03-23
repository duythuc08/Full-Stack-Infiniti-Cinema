package com.duythuc_dh52201541.moive_ticket_infinity_cinema.mapper;


import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.RegisterRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.UserUpdateRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.request.UsersCreationRequest;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UserClientRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UserMenuRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.dto.respone.UsersRespone;
import com.duythuc_dh52201541.moive_ticket_infinity_cinema.entity.Users;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    Users toUsers(UsersCreationRequest request);

    UsersRespone toUsersRespone(Users users);

    UserMenuRespone toUserMenuRespone(Users users);

    @Mapping(source = "membershipTier.name", target = "memberShipTierName")
    UserClientRespone toUserClientRespone(Users users);

    @Mapping(target = "role", ignore = true)
    void updateUser(@MappingTarget Users user, UserUpdateRequest request);

    Users toRegisterUser(RegisterRequest request);
}
