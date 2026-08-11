package com.example.demo.model.dto;

import com.example.demo.model.entity.EstadoSolicitud;
import java.time.LocalDateTime;

public class SolicitudDTO {
    private Long id;
    private String codigoSeguimiento;
    private TipoTramiteDTO tipoTramite;
    private EstadoSolicitud estado;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaActualizacion;
    private String codigoOperacionBanco;
    private String alumnoNombre;
    private String alumnoDni;

    public SolicitudDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoSeguimiento() { return codigoSeguimiento; }
    public void setCodigoSeguimiento(String codigoSeguimiento) { this.codigoSeguimiento = codigoSeguimiento; }
    public TipoTramiteDTO getTipoTramite() { return tipoTramite; }
    public void setTipoTramite(TipoTramiteDTO tipoTramite) { this.tipoTramite = tipoTramite; }
    public EstadoSolicitud getEstado() { return estado; }
    public void setEstado(EstadoSolicitud estado) { this.estado = estado; }
    public LocalDateTime getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(LocalDateTime fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }
    public void setFechaActualizacion(LocalDateTime fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
    public String getCodigoOperacionBanco() { return codigoOperacionBanco; }
    public void setCodigoOperacionBanco(String codigoOperacionBanco) { this.codigoOperacionBanco = codigoOperacionBanco; }
    public String getAlumnoNombre() { return alumnoNombre; }
    public void setAlumnoNombre(String alumnoNombre) { this.alumnoNombre = alumnoNombre; }
    public String getAlumnoDni() { return alumnoDni; }
    public void setAlumnoDni(String alumnoDni) { this.alumnoDni = alumnoDni; }
}
