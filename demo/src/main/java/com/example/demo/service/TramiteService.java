package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.dto.TipoTramiteDTO;
import com.example.demo.model.dto.TipoTramiteRequestDTO;
import com.example.demo.model.entity.TipoTramite;
import com.example.demo.repository.TipoTramiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TramiteService {

    private final TipoTramiteRepository tipoTramiteRepository;

    public TramiteService(TipoTramiteRepository tipoTramiteRepository) {
        this.tipoTramiteRepository = tipoTramiteRepository;
    }

    /** Público: sólo activos */
    public List<TipoTramiteDTO> getTramitesActivos() {
        return tipoTramiteRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /** Admin: todos (activos e inactivos) */
    public List<TipoTramiteDTO> getTodos() {
        return tipoTramiteRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /** Admin: crear */
    @Transactional
    public TipoTramiteDTO crear(TipoTramiteRequestDTO request) {
        TipoTramite t = new TipoTramite(
                request.getNombre(),
                request.getDescripcion(),
                request.getCosto(),
                request.getActivo() != null ? request.getActivo() : true
        );
        return mapToDTO(tipoTramiteRepository.save(t));
    }

    /** Admin: editar */
    @Transactional
    public TipoTramiteDTO actualizar(Long id, TipoTramiteRequestDTO request) {
        TipoTramite t = tipoTramiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trámite no encontrado con id: " + id));
        t.setNombre(request.getNombre());
        t.setDescripcion(request.getDescripcion());
        t.setCosto(request.getCosto());
        if (request.getActivo() != null) t.setActivo(request.getActivo());
        return mapToDTO(tipoTramiteRepository.save(t));
    }

    /** Admin: soft-delete (toggle activo) */
    @Transactional
    public TipoTramiteDTO toggleActivo(Long id) {
        TipoTramite t = tipoTramiteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trámite no encontrado con id: " + id));
        t.setActivo(!t.getActivo());
        return mapToDTO(tipoTramiteRepository.save(t));
    }

    /** Admin: borrar definitivamente */
    @Transactional
    public void eliminar(Long id) {
        if (!tipoTramiteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Trámite no encontrado con id: " + id);
        }
        tipoTramiteRepository.deleteById(id);
    }

    private TipoTramiteDTO mapToDTO(TipoTramite tramite) {
        TipoTramiteDTO dto = new TipoTramiteDTO();
        dto.setId(tramite.getId());
        dto.setNombre(tramite.getNombre());
        dto.setDescripcion(tramite.getDescripcion());
        dto.setCosto(tramite.getCosto());
        dto.setActivo(tramite.getActivo());
        return dto;
    }
}
