package com.bi.fiscalbi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bi.fiscalbi.domain.entity.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {

}
