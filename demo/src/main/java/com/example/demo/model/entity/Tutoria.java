package com.example.demo.model.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tutorias")
public class Tutoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombreAlumno;

    @Column(nullable = false)
    private String curso;

    @Column(nullable = false)
    private LocalDate fechaSolicitud;

    @Column(nullable = false, length = 20)
    private String estado = "PENDIENTE";

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    public Tutoria() {}

    public Tutoria(Long id, String nombreAlumno, String curso, LocalDate fechaSolicitud, String estado) {
        this.id = id;
        this.nombreAlumno = nombreAlumno;
        this.curso = curso;
        this.fechaSolicitud = fechaSolicitud;
        this.estado = estado;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombreAlumno() {
        return nombreAlumno;
    }

    public void setNombreAlumno(String nombreAlumno) {
        this.nombreAlumno = nombreAlumno;
    }

    public String getCurso() {
        return curso;
    }

    public void setCurso(String curso) {
        this.curso = curso;
    }

    public LocalDate getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(LocalDate fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Tutor getTutor() {
        return tutor;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }
}
