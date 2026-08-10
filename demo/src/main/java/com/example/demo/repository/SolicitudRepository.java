package com.example.demo.repository;

import com.example.demo.model.entity.Solicitud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.example.demo.model.entity.EstadoSolicitud;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    List<Solicitud> findByAlumnoIdOrderByFechaSolicitudDesc(Long alumnoId);
    
    Page<Solicitud> findAllByOrderByFechaSolicitudDesc(Pageable pageable);
    Page<Solicitud> findByEstadoOrderByFechaSolicitudDesc(EstadoSolicitud estado, Pageable pageable);
    Page<Solicitud> findByAlumnoDniContainingOrderByFechaSolicitudDesc(String dni, Pageable pageable);
    Page<Solicitud> findByAlumnoDniContainingAndEstadoOrderByFechaSolicitudDesc(String dni, EstadoSolicitud estado, Pageable pageable);
}
