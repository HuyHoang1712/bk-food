package com.bkfood.api.auth;

import com.bkfood.api.auth.dto.AuthResponse;
import com.bkfood.api.auth.dto.GoogleTokenRequest;
import com.bkfood.api.auth.dto.LoginRequest;
import com.bkfood.api.auth.dto.RegisterRequest;
import com.bkfood.api.user.Role;
import com.bkfood.api.user.User;
import com.bkfood.api.user.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${google.client-id:}")
    private String googleClientId;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã tồn tại");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setRole(Optional.ofNullable(request.getRole()).orElse(Role.CUSTOMER));
        user.setAuthorities(Set.of(user.getRole().name()));
        user.setProvider("local");

        userRepository.save(user);
        String token = buildToken(user);
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Sai email hoặc mật khẩu");
        }

        String token = buildToken(user);
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    public AuthResponse loginWithGoogle(GoogleTokenRequest request) {
        GoogleIdToken.Payload payload = verifyGoogleToken(request.getIdToken());
        if (payload == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token Google không hợp lệ");
        }

        String email = payload.getEmail();
        String subject = payload.getSubject();
        String name = request.getFullName() != null ? request.getFullName() : (String) payload.get("name");

        User user = userRepository
                .findByEmail(email)
                .orElseGet(() -> {
                    User created = new User();
                    created.setEmail(email);
                    created.setFullName(name != null ? name : "Google User");
                    created.setPassword(passwordEncoder.encode(subject));
                    created.setRole(Role.CUSTOMER);
                    created.setAuthorities(Set.of(Role.CUSTOMER.name()));
                    created.setProvider("google");
                    created.setProviderId(subject);
                    return created;
                });

        user.setProvider("google");
        user.setProviderId(subject);
        if (user.getFullName() == null && name != null) {
            user.setFullName(name);
        }
        if (user.getAuthorities() == null || user.getAuthorities().isEmpty()) {
            user.setAuthorities(Set.of(user.getRole().name()));
        }

        userRepository.save(user);
        String token = buildToken(user);
        return new AuthResponse(token, user.getEmail(), user.getFullName(), user.getRole());
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Thiếu GOOGLE_CLIENT_ID cho Google OAuth");
        }

        try {
            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                            .setAudience(List.of(googleClientId))
                            .build();
            GoogleIdToken idToken = verifier.verify(idTokenString);
            return idToken != null ? idToken.getPayload() : null;
        } catch (GeneralSecurityException | IOException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Không thể xác thực Google: " + e.getMessage());
        }
    }

    private String buildToken(User user) {
        return jwtService.generateToken(
                user.getEmail(),
                Map.of(
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "name", user.getFullName()));
    }
}
