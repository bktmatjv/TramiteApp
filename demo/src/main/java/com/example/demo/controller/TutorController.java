package com.example.demo.controller;

import com.example.demo.model.dto.TutorDTO;
import com.example.demo.model.entity.Tutor;
import com.example.demo.repository.TutorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tutores")
public class TutorController {

    private final TutorRepository tutorRepository;

    public TutorController(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    @GetMapping
    public ResponseEntity<List<TutorDTO>> getAllTutores() {
        List<TutorDTO> tutores = tutorRepository.findAll().stream().map(tutor -> {
            TutorDTO dto = new TutorDTO();
            dto.setId(tutor.getId());
            dto.setNombre(tutor.getNombre());
            dto.setEspecialidad(tutor.getEspecialidad());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(tutores);
    }
}
