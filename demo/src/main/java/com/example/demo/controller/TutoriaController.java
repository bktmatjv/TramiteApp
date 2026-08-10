package com.example.demo.controller;

import com.example.demo.model.dto.TutoriaDTO;
import com.example.demo.service.TutoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tutorias")
public class TutoriaController {

    private final TutoriaService tutoriaService;

    public TutoriaController(TutoriaService tutoriaService) {
        this.tutoriaService = tutoriaService;
    }

    @GetMapping
    public ResponseEntity<List<TutoriaDTO>> getAllTutorias() {
        return ResponseEntity.ok(tutoriaService.getAllTutorias());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TutoriaDTO> getTutoriaById(@PathVariable Long id) {
        return ResponseEntity.ok(tutoriaService.getTutoriaById(id));
    }

    @PostMapping
    public ResponseEntity<TutoriaDTO> createTutoria(@Valid @RequestBody TutoriaDTO tutoriaDTO) {
        TutoriaDTO created = tutoriaService.createTutoria(tutoriaDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TutoriaDTO> updateTutoria(@PathVariable Long id, @Valid @RequestBody TutoriaDTO tutoriaDTO) {
        return ResponseEntity.ok(tutoriaService.updateTutoria(id, tutoriaDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTutoria(@PathVariable Long id) {
        tutoriaService.deleteTutoria(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/asignar/{tutorId}")
    public ResponseEntity<TutoriaDTO> asignarTutor(@PathVariable Long id, @PathVariable Long tutorId) {
        return ResponseEntity.ok(tutoriaService.asignarTutor(id, tutorId));
    }

    @PutMapping("/{id}/completar")
    public ResponseEntity<TutoriaDTO> completarTutoria(@PathVariable Long id) {
        return ResponseEntity.ok(tutoriaService.completarTutoria(id));
    }
}
