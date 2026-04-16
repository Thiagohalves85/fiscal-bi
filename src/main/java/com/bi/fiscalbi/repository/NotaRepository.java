package com.bi.fiscalbi.repository;

import com.bi.fiscalbi.domain.entity.Nota;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    // Filtra notas pelo ID do cliente (empresa)
    List<Nota> findByClienteCodCliente(Long codCliente);

    // Filtra notas pelo ID da cidade do cliente
    List<Nota> findByClienteCidadeCodCidade(Long codCidade);
}

