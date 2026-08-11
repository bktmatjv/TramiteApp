package com.example.demo.model.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class TipoTramiteRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    private String descripcion;

    @NotNull(message = "El costo es obligatorio")
    @DecimalMin(value = "0.01", message = "El costo debe ser mayor a 0")
    private BigDecimal costo;

    private Boolean activo = true;

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
