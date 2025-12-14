package com.bkfood.api.auth;

import com.bkfood.api.user.Role;
import com.bkfood.api.user.User;
import com.bkfood.api.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Set;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtService jwtService;

    @Value("${app.oauth2.redirect-uri:http://localhost:3000/auth/login}")
    private String defaultRedirect;

    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException {
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauth2User = token.getPrincipal();
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String providerId = oauth2User.getName();

        User user = userRepository
                .findByEmail(email)
                .orElseGet(() -> {
                    User created = new User();
                    created.setEmail(email);
                    created.setFullName(name != null ? name : "Google User");
                    created.setPassword(providerId);
                    created.setRole(Role.CUSTOMER);
                    created.setAuthorities(Set.of(Role.CUSTOMER.name()));
                    created.setProvider(token.getAuthorizedClientRegistrationId());
                    created.setProviderId(providerId);
                    return created;
                });

        if (user.getAuthorities() == null || user.getAuthorities().isEmpty()) {
            user.setAuthorities(Set.of(user.getRole().name()));
        }
        user.setProvider(token.getAuthorizedClientRegistrationId());
        user.setProviderId(providerId);
        if (name != null) {
            user.setFullName(name);
        }

        userRepository.save(user);

        String jwt = jwtService.generateToken(
                user.getEmail(), Map.of("email", user.getEmail(), "role", user.getRole().name(), "name", user.getFullName()));

        String target = request.getParameter("redirect_uri");
        if (!StringUtils.hasText(target)) {
            target = defaultRedirect;
        }

        String redirectUrl = target + (target.contains("?") ? "&" : "?") + "token=" + URLEncoder.encode(jwt, StandardCharsets.UTF_8);
        response.sendRedirect(redirectUrl);
    }
}
