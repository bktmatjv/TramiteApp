package com.example.demo.model.dto;

import com.example.demo.model.entity.EstadoSolicitud;
import jakarta.validation.constraints.NotNull;

public class CambiarEstadoRequestDTO {
    @NotNull(message = "El nuevo estado es obligatorio")
    private EstadoSolicitud nuevoEstado;

    public CambiarEstadoRequestDTO() {}

    public EstadoSolicitud getNuevoEstado() { return nuevoEstado; }
    public void setNuevoEstado(EstadoSolicitud nuevoEstado) { this.nuevoEstado = nuevoEstado; }
}
