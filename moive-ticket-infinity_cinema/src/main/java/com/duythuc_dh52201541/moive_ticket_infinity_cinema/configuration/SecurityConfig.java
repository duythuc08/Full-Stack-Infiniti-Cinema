package com.duythuc_dh52201541.moive_ticket_infinity_cinema.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;


@Configuration
@EnableWebSecurity   // Bật Spring Security cho ứng dụng
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    // Các endpoint public (không cần authentication)
    private final String[] PUBLIC_ENDPOINTS = {
            "/auth/login",
            "/auth/introspect",
            "/auth/logout",
            "/auth/refresh",
            "/auth/register",
            "/auth/verify",
            "/auth/resendOTP",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/movies/*",
            "/movies/showing",
            "/movies/comingSoon",
            "/movies/imax",
            "/movies/getMovies",
            "/banners/getBanners/**",
            "/banners/getBannerByMovieId/*",
            "/cinemas/getCinemas",
            "/cinemas/getCinema/*",
            "/rooms/getRooms/**",
            "/showtimes/getShowTimes/**",
            "/showtimes/getShowTimes/by-cinema/**",
            "/showtimes/getShowTimes/active/by-movie/**",
            // Quick Booking Bar endpoints — phải public (FE gọi không có token)
            "/showtimes/movies-by-cinema/**",
            "/showtimes/cinemas-by-movie/**",
            "/showtimes/now-showing-movies",
            "/showtimes/dates",
            "/showtimes/slots",
            // Movie pagination endpoints
            "/movies/showing/paged",
            "/movies/comingSoon/paged",
            "/movies/imax/paged",
            "/payment/vnpay-callback",


    };
    private final String[] ADMIN_ENDPOINTS = {
            "/users",
            "/genre",
            "/movies",
            "/api/files/upload",
            "/banners",
            "/cinemas",
            "/cinemas/bluk",
            "/rooms",
            "/rooms/bluk",
            "/showtimes",
            "/showtimes/bluk",

    };


    // Định nghĩa SecurityFilterChain (thay thế WebSecurityConfigurerAdapter cũ)
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        // Cấu hình quyền truy cập cho các endpoint
        httpSecurity.authorizeHttpRequests(request ->
                request
                        // Cho phép truy cập mà không cần login với các endpoint trong PUBLIC_ENDPOINTS
                        .requestMatchers( PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(ADMIN_ENDPOINTS).hasAuthority("ROLE_ADMIN")
                        // Các request khác bắt buộc phải xác thực
                        .anyRequest()
                        .authenticated()
        );

        // Cấu hình xác thực bằng JWT (OAuth2 Resource Server)
        httpSecurity.oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(customJwtDecoder)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint())

        );

        // Tắt CSRF (phù hợp với REST API, vì thường dùng token chứ không dùng session)
        httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable);

        // Trả về cấu hình hoàn chỉnh
        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        // Converter mặc định của Spring để chuyển các claim "scope"/"authorities"
        // trong JWT thành danh sách GrantedAuthority (quyền) của user
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

        // Đặt prefix cho authority. Mặc định Spring thêm "SCOPE_" vào claim scope trong JWT
        // Ở đây đổi lại thành "ROLE_", ví dụ:
        // scope = "ADMIN USER"  -> authorities = ["ROLE_ADMIN", "ROLE_USER"]
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        // Tạo converter chính cho JwtAuthenticationToken
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();

        // Gán converter để chuyển đổi authorities từ JWT vào converter chính
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        // Trả về bean để Spring Security dùng khi xác thực JWT
        return jwtAuthenticationConverter;
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173", "http://localhost:3000")); // ✅ FE port của bạn
        config.setAllowedHeaders(List.of("Origin", "Content-Type", "Accept", "Authorization"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }
}