package com.example.demo.controller;

import com.example.demo.model.dto.AuthRequest;
import com.example.demo.model.dto.AuthResponse;
import com.example.demo.model.dto.RegisterRequest;
import com.example.demo.model.entity.Role;
import com.example.demo.model.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        // Generar token con id y rol
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        String token = jwtUtil.generateToken(userDetails.getUsername(), userDetails.getId(), role, userDetails.getNombre());

        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email ya en uso");
        }
        if (usuarioRepository.findByDni(request.getDni()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: DNI ya registrado");
        }

        Usuario nuevo = new Usuario(
                request.getDni(),
                request.getNombres(),
                request.getApellidos(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                Role.valueOf(request.getRol())
        );
        usuarioRepository.save(nuevo);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
