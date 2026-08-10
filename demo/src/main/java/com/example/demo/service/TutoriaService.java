package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.dto.TutoriaDTO;
import com.example.demo.model.dto.TutorDTO;
import com.example.demo.model.entity.Tutoria;
import com.example.demo.model.entity.Tutor;
import com.example.demo.repository.TutoriaRepository;
import com.example.demo.repository.TutorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TutoriaService {

    private final TutoriaRepository tutoriaRepository;
    private final TutorRepository tutorRepository;

    public TutoriaService(TutoriaRepository tutoriaRepository, TutorRepository tutorRepository) {
        this.tutoriaRepository = tutoriaRepository;
        this.tutorRepository = tutorRepository;
    }

    public List<TutoriaDTO> getAllTutorias() {
        return tutoriaRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public TutoriaDTO getTutoriaById(Long id) {
        Tutoria tutoria = tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con ID: " + id));
        return mapToDTO(tutoria);
    }

    public TutoriaDTO createTutoria(TutoriaDTO tutoriaDTO) {
        Tutoria tutoria = mapToEntity(tutoriaDTO);
        Tutoria savedTutoria = tutoriaRepository.save(tutoria);
        return mapToDTO(savedTutoria);
    }

    public TutoriaDTO updateTutoria(Long id, TutoriaDTO tutoriaDTO) {
        Tutoria tutoria = tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con ID: " + id));

        tutoria.setNombreAlumno(tutoriaDTO.getNombreAlumno());
        tutoria.setCurso(tutoriaDTO.getCurso());
        tutoria.setFechaSolicitud(tutoriaDTO.getFechaSolicitud());
        tutoria.setEstado(tutoriaDTO.getEstado());

        Tutoria updatedTutoria = tutoriaRepository.save(tutoria);
        return mapToDTO(updatedTutoria);
    }

    public void deleteTutoria(Long id) {
        Tutoria tutoria = tutoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con ID: " + id));
        tutoriaRepository.delete(tutoria);
    }

    @Transactional
    public TutoriaDTO asignarTutor(Long tutoriaId, Long tutorId) {
        Tutoria tutoria = tutoriaRepository.findById(tutoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con ID: " + tutoriaId));

        if (!"PENDIENTE".equals(tutoria.getEstado())) {
            throw new IllegalStateException("La tutoría no está en estado PENDIENTE. Estado actual: " + tutoria.getEstado());
        }

        Tutor tutor = tutorRepository.findById(tutorId)
                .orElseThrow(() -> new ResourceNotFoundException("Tutor no encontrado con ID: " + tutorId));

        tutoria.setTutor(tutor);
        tutoria.setEstado("ASIGNADA");
        
        return mapToDTO(tutoriaRepository.save(tutoria));
    }

    @Transactional
    public TutoriaDTO completarTutoria(Long tutoriaId) {
        Tutoria tutoria = tutoriaRepository.findById(tutoriaId)
                .orElseThrow(() -> new ResourceNotFoundException("Tutoría no encontrada con ID: " + tutoriaId));

        if (!"ASIGNADA".equals(tutoria.getEstado())) {
            throw new IllegalStateException("La tutoría no puede ser completada. Estado actual: " + tutoria.getEstado());
        }

        tutoria.setEstado("FINALIZADA");
        return mapToDTO(tutoriaRepository.save(tutoria));
    }

    private TutoriaDTO mapToDTO(Tutoria tutoria) {
        TutoriaDTO dto = new TutoriaDTO();
        dto.setId(tutoria.getId());
        dto.setNombreAlumno(tutoria.getNombreAlumno());
        dto.setCurso(tutoria.getCurso());
        dto.setFechaSolicitud(tutoria.getFechaSolicitud());
        dto.setEstado(tutoria.getEstado());
        
        if (tutoria.getTutor() != null) {
            TutorDTO tutorDTO = new TutorDTO();
            tutorDTO.setId(tutoria.getTutor().getId());
            tutorDTO.setNombre(tutoria.getTutor().getNombre());
            tutorDTO.setEspecialidad(tutoria.getTutor().getEspecialidad());
            dto.setTutor(tutorDTO);
        }
        
        return dto;
    }

    private Tutoria mapToEntity(TutoriaDTO dto) {
        Tutoria tutoria = new Tutoria();
        tutoria.setId(dto.getId());
        tutoria.setNombreAlumno(dto.getNombreAlumno());
        tutoria.setCurso(dto.getCurso());
        tutoria.setFechaSolicitud(dto.getFechaSolicitud());
        tutoria.setEstado(dto.getEstado());
        return tutoria;
    }
}
