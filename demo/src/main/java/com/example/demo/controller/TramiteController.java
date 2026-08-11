package com.example.demo.controller;

import com.example.demo.model.dto.TipoTramiteDTO;
import com.example.demo.model.dto.TipoTramiteRequestDTO;
import com.example.demo.service.TramiteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class TramiteController {

    private final TramiteService tramiteService;

    public TramiteController(TramiteService tramiteService) {
        this.tramiteService = tramiteService;
    }

    /** PUBLIC — catálogo sólo activos */
    @GetMapping("/tramites")
    public ResponseEntity<List<TipoTramiteDTO>> listarActivos() {
        return ResponseEntity.ok(tramiteService.getTramitesActivos());
    }

    /** ADMIN — listar todos (activos + inactivos) */
    @GetMapping("/admin/tramites")
    public ResponseEntity<List<TipoTramiteDTO>> listarTodos() {
        return ResponseEntity.ok(tramiteService.getTodos());
    }

    /** ADMIN — crear nuevo trámite */
    @PostMapping("/admin/tramites")
    public ResponseEntity<TipoTramiteDTO> crear(@Valid @RequestBody TipoTramiteRequestDTO request) {
        return new ResponseEntity<>(tramiteService.crear(request), HttpStatus.CREATED);
    }

    /** ADMIN — actualizar trámite */
    @PutMapping("/admin/tramites/{id}")
    public ResponseEntity<TipoTramiteDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TipoTramiteRequestDTO request) {
        return ResponseEntity.ok(tramiteService.actualizar(id, request));
    }

    /** ADMIN — toggle activo/inactivo (soft delete) */
    @PatchMapping("/admin/tramites/{id}/toggle")
    public ResponseEntity<TipoTramiteDTO> toggleActivo(@PathVariable Long id) {
        return ResponseEntity.ok(tramiteService.toggleActivo(id));
    }

    /** ADMIN — eliminar definitivamente */
    @DeleteMapping("/admin/tramites/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        tramiteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
