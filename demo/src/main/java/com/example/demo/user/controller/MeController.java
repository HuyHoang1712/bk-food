package com.example.demo.user.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.user.User;
import com.example.demo.user.dto.MeResponse;
import com.example.demo.user.repository.UserRepository;

@RestController
@RequestMapping("/api")
public class MeController {

  private final UserRepository userRepository;

  public MeController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/me")
  public MeResponse me(Authentication authentication) {
    String login = authentication.getName(); // whatever you used as username in Basic Auth

    User user = userRepository.findByEmail(login)
        .orElseThrow(() -> new RuntimeException("User not found: " + login));

    return new MeResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.getRole().name() == "restaurant" ? user.getRestaurant().getId() : null);
  }
}