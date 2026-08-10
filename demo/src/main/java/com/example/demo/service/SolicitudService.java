package com.example.demo.service;

import com.example.demo.exception.EstadoInvalidoException;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.exception.TramiteNoEncontradoException;
import com.example.demo.model.dto.NuevaSolicitudRequestDTO;
import com.example.demo.model.dto.SolicitudDTO;
import com.example.demo.model.dto.TipoTramiteDTO;
import com.example.demo.model.entity.EstadoSolicitud;
import com.example.demo.model.entity.Solicitud;
import com.example.demo.model.entity.TipoTramite;
import com.example.demo.model.entity.Usuario;
import com.example.demo.repository.SolicitudRepository;
import com.example.demo.repository.TipoTramiteRepository;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final TipoTramiteRepository tipoTramiteRepository;
    private final UsuarioRepository usuarioRepository;

    public SolicitudService(SolicitudRepository solicitudRepository, TipoTramiteRepository tipoTramiteRepository, UsuarioRepository usuarioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.tipoTramiteRepository = tipoTramiteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public SolicitudDTO crearSolicitud(NuevaSolicitudRequestDTO request, Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        
        TipoTramite tramite = tipoTramiteRepository.findById(request.getTipoTramiteId())
                .orElseThrow(() -> new TramiteNoEncontradoException("Tipo de trámite no encontrado"));

        if (!tramite.getActivo()) {
            throw new EstadoInvalidoException("El trámite seleccionado no está activo");
        }

        Solicitud solicitud = new Solicitud();
        solicitud.setAlumno(usuario);
        solicitud.setTipoTramite(tramite);
        solicitud.setEstado(EstadoSolicitud.PENDIENTE_PAGO);
        // Generar código de seguimiento
        solicitud.setCodigoSeguimiento("TRM-" + System.currentTimeMillis());

        Solicitud guardada = solicitudRepository.save(solicitud);
        return mapToDTO(guardada);
    }

    @Transactional
    public SolicitudDTO reportarPago(Long solicitudId, String codigoOperacion, Long usuarioId) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

        if (!solicitud.getAlumno().getId().equals(usuarioId)) {
            throw new org.springframework.security.access.AccessDeniedException("No tienes permiso para modificar esta solicitud");
        }

        if (solicitud.getEstado() != EstadoSolicitud.PENDIENTE_PAGO && solicitud.getEstado() != EstadoSolicitud.OBSERVADO) {
            throw new EstadoInvalidoException("La solicitud no está en estado válido para reportar pago");
        }

        solicitud.setCodigoOperacionBanco(codigoOperacion);
        solicitud.setEstado(EstadoSolicitud.EN_REVISION);

        Solicitud guardada = solicitudRepository.save(solicitud);
        return mapToDTO(guardada);
    }

    @Transactional
    public SolicitudDTO cambiarEstado(Long solicitudId, EstadoSolicitud nuevoEstado) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitud no encontrada"));

        // Lógica simple para evitar saltos raros.
        if (solicitud.getEstado() == EstadoSolicitud.EMITIDO) {
            throw new EstadoInvalidoException("No se puede cambiar el estado de un trámite ya emitido");
        }

        solicitud.setEstado(nuevoEstado);
        Solicitud guardada = solicitudRepository.save(solicitud);
        return mapToDTO(guardada);
    }

    public List<SolicitudDTO> misTramites(Long usuarioId) {
        return solicitudRepository.findByAlumnoIdOrderByFechaSolicitudDesc(usuarioId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public org.springframework.data.domain.Page<SolicitudDTO> obtenerTodasLasSolicitudes(String dni, EstadoSolicitud estado, org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<Solicitud> page;
        if (dni != null && !dni.isEmpty() && estado != null) {
            page = solicitudRepository.findByAlumnoDniContainingAndEstadoOrderByFechaSolicitudDesc(dni, estado, pageable);
        } else if (dni != null && !dni.isEmpty()) {
            page = solicitudRepository.findByAlumnoDniContainingOrderByFechaSolicitudDesc(dni, pageable);
        } else if (estado != null) {
            page = solicitudRepository.findByEstadoOrderByFechaSolicitudDesc(estado, pageable);
        } else {
            page = solicitudRepository.findAllByOrderByFechaSolicitudDesc(pageable);
        }
        return page.map(this::mapToDTO);
    }

    private SolicitudDTO mapToDTO(Solicitud solicitud) {
        SolicitudDTO dto = new SolicitudDTO();
        dto.setId(solicitud.getId());
        dto.setCodigoSeguimiento(solicitud.getCodigoSeguimiento());
        dto.setEstado(solicitud.getEstado());
        dto.setFechaSolicitud(solicitud.getFechaSolicitud());
        dto.setFechaActualizacion(solicitud.getFechaActualizacion());
        dto.setCodigoOperacionBanco(solicitud.getCodigoOperacionBanco());

        TipoTramiteDTO tramiteDTO = new TipoTramiteDTO();
        tramiteDTO.setId(solicitud.getTipoTramite().getId());
        tramiteDTO.setNombre(solicitud.getTipoTramite().getNombre());
        tramiteDTO.setDescripcion(solicitud.getTipoTramite().getDescripcion());
        tramiteDTO.setCosto(solicitud.getTipoTramite().getCosto());

        dto.setTipoTramite(tramiteDTO);
        return dto;
    }
}
