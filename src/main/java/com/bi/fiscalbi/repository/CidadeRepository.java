package com.bi.fiscalbi.repository;

import com.bi.fiscalbi.domain.entity.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CidadeRepository extends JpaRepository<Cidade, Long> {
}
