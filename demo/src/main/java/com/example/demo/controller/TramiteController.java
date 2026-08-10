package com.example.demo.controller;

import com.example.demo.model.dto.TipoTramiteDTO;
import com.example.demo.service.TramiteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tramites")
public class TramiteController {

    private final TramiteService tramiteService;

    public TramiteController(TramiteService tramiteService) {
        this.tramiteService = tramiteService;
    }

    @GetMapping
    public ResponseEntity<List<TipoTramiteDTO>> listarTramitesActivos() {
        return ResponseEntity.ok(tramiteService.getTramitesActivos());
    }
}
