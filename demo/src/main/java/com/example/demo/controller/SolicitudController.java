package com.example.demo.controller;

import com.example.demo.model.dto.NuevaSolicitudRequestDTO;
import com.example.demo.model.dto.ReportarPagoRequestDTO;
import com.example.demo.model.dto.SolicitudDTO;
import com.example.demo.security.CustomUserDetails;
import com.example.demo.service.SolicitudService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController(SolicitudService solicitudService) {
        this.solicitudService = solicitudService;
    }

    @PostMapping
    public ResponseEntity<SolicitudDTO> crearSolicitud(@RequestBody NuevaSolicitudRequestDTO request, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        SolicitudDTO solicitud = solicitudService.crearSolicitud(request, userDetails.getId());
        return new ResponseEntity<>(solicitud, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/pago")
    public ResponseEntity<SolicitudDTO> reportarPago(@PathVariable Long id, @RequestBody ReportarPagoRequestDTO request, Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        SolicitudDTO solicitud = solicitudService.reportarPago(id, request.getCodigoOperacionBanco(), userDetails.getId());
        return ResponseEntity.ok(solicitud);
    }

    @GetMapping("/mis-tramites")
    public ResponseEntity<List<SolicitudDTO>> misTramites(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        return ResponseEntity.ok(solicitudService.misTramites(userDetails.getId()));
    }
}
