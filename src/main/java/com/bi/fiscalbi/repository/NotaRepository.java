package com.bi.fiscalbi.repository;

import com.bi.fiscalbi.domain.entity.Nota;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

import java.math.BigDecimal;

public interface NotaRepository extends JpaRepository<Nota, Long> {

    @EntityGraph(attributePaths = { "cliente", "cliente.cidade", "parcelas" })
    @NonNull
    Page<Nota> findAll(@NonNull Pageable pageable);

    @EntityGraph(attributePaths = { "cliente", "cliente.cidade", "parcelas" })
    Page<Nota> findByClienteCodCliente(Long codCliente, Pageable pageable);

    @EntityGraph(attributePaths = { "cliente", "cliente.cidade", "parcelas" })
    Page<Nota> findByClienteCidadeCodCidade(Long codCidade, Pageable pageable);

    @EntityGraph(attributePaths = { "cliente", "cliente.cidade", "parcelas" })
    @Query("SELECT n FROM Nota n WHERE LOWER(CAST(n.codNota AS string)) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(n.cliente.nome) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Nota> findBySearch(String search, Pageable pageable);

    @Query("SELECT COALESCE(SUM(n.valorTotal), 0) FROM Nota n")
    BigDecimal sumValorTotal();

    @Query("SELECT COALESCE(SUM(p.valorRecebimento), 0) FROM ParcNota p")
    BigDecimal sumValorRecebido();
}
