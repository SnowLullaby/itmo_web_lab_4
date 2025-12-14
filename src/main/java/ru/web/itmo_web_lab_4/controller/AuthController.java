package ru.web.itmo_web_lab_4.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import ru.web.itmo_web_lab_4.config.JwtUtil;
import ru.web.itmo_web_lab_4.entity.User;
import ru.web.itmo_web_lab_4.service.UserService;
import ru.web.itmo_web_lab_4.repository.UserRepository;
import org.springframework.security.core.AuthenticationException;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:28002")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password())
            );
            String token = jwtUtil.generateToken(request.username());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(401).body("Неверный логин или пароль");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body("Неверный логин или пароль");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        Optional<User> existing = userRepository.findByUsername(request.username());
        if (existing.isPresent()) {
            return ResponseEntity.status(409).body("Username already exists");
        }
        userService.register(request.username(), request.password());
        return ResponseEntity.ok("Регистрация успешна");
    }
}

record AuthRequest(String username, String password) {}
record AuthResponse(String token) {}