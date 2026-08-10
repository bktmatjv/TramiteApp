package com.example.demo.service;

import com.example.demo.model.dto.TipoTramiteDTO;
import com.example.demo.model.entity.TipoTramite;
import com.example.demo.repository.TipoTramiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TramiteService {

    private final TipoTramiteRepository tipoTramiteRepository;

    public TramiteService(TipoTramiteRepository tipoTramiteRepository) {
        this.tipoTramiteRepository = tipoTramiteRepository;
    }

    public List<TipoTramiteDTO> getTramitesActivos() {
        return tipoTramiteRepository.findByActivoTrue().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private TipoTramiteDTO mapToDTO(TipoTramite tramite) {
        TipoTramiteDTO dto = new TipoTramiteDTO();
        dto.setId(tramite.getId());
        dto.setNombre(tramite.getNombre());
        dto.setDescripcion(tramite.getDescripcion());
        dto.setCosto(tramite.getCosto());
        return dto;
    }
}
