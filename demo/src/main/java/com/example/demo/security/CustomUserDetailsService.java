package com.example.demo.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.user.User;
import com.example.demo.user.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService{
    private final UserRepository userRepo;
    public CustomUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Email not found!"));
        return new UserDetailsImpl(user);
    }

}
