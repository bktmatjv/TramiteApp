package com.example.demo.controller;

import com.example.demo.model.dto.CambiarEstadoRequestDTO;
import com.example.demo.model.dto.SolicitudDTO;
import com.example.demo.service.SolicitudService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.demo.model.entity.EstadoSolicitud;

@RestController
@RequestMapping("/api/v1/admin/solicitudes")
public class AdminSolicitudController {

    private final SolicitudService solicitudService;

    public AdminSolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<SolicitudDTO> cambiarEstado(@PathVariable Long id, @Valid @RequestBody CambiarEstadoRequestDTO request) {
        SolicitudDTO solicitud = solicitudService.cambiarEstado(id, request.getNuevoEstado());
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping
    public ResponseEntity<Page<SolicitudDTO>> obtenerTodas(
            @RequestParam(required = false) String dni,
            @RequestParam(required = false) EstadoSolicitud estado,
            Pageable pageable) {
        return ResponseEntity.ok(solicitudService.obtenerTodasLasSolicitudes(dni, estado, pageable));
    }
}
