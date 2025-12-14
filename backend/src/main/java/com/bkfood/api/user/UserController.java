package com.bkfood.api.user;

import com.bkfood.api.auth.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    public UserController(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authHeader,
            HttpServletRequest request) {
        if (!StringUtils.hasText(authHeader) || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Thiếu token"));
        }

        String token = authHeader.substring(7);
        Claims claims = jwtService.parse(token);
        String email = claims.getSubject();

        return userRepository
                .findByEmail(email)
                .map(user -> ResponseEntity.ok(
                        Map.of(
                                "email", user.getEmail(),
                                "fullName", user.getFullName(),
                                "role", user.getRole(),
                                "provider", user.getProvider())))
                .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Không tìm thấy người dùng")));
    }
}
