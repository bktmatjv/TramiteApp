package com.example.demo.controller;

import com.example.demo.model.dto.ActualizarPerfilRequest;
import com.example.demo.model.dto.UsuarioDTO;
import com.example.demo.model.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.security.CustomUserDetails;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getPerfil(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Usuario usuario = usuarioRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return ResponseEntity.ok(new UsuarioDTO(usuario.getDni(), usuario.getNombres(), usuario.getApellidos(), usuario.getEmail()));
    }

    @PutMapping("/me")
    public ResponseEntity<UsuarioDTO> actualizarPerfil(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                       @Valid @RequestBody ActualizarPerfilRequest request) {
        Usuario usuario = usuarioRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        usuario.setNombres(request.getNombres());
        usuario.setApellidos(request.getApellidos());
        usuarioRepository.save(usuario);
        
        return ResponseEntity.ok(new UsuarioDTO(usuario.getDni(), usuario.getNombres(), usuario.getApellidos(), usuario.getEmail()));
    }
}
