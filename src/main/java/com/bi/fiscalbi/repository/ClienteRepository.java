package com.bi.fiscalbi.repository;

import com.bi.fiscalbi.domain.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
