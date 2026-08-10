package com.example.demo.model.dto;

import java.math.BigDecimal;

public class TipoTramiteDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal costo;

    public TipoTramiteDTO() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getCosto() { return costo; }
    public void setCosto(BigDecimal costo) { this.costo = costo; }
}
