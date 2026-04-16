package com.bi.fiscalbi.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "parcNotas")
public class ParcNota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codParcNota")
    private Long codParcNota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codNota", nullable = false)
    private Nota nota;

    @jakarta.validation.constraints.NotNull(message = "O número da parcela é obrigatório")
    @jakarta.validation.constraints.Min(value = 1, message = "O número da parcela deve ser maior ou igual a 1")
    private Integer numero;

    @jakarta.validation.constraints.NotNull(message = "O valor de vencimento é obrigatório")
    @jakarta.validation.constraints.DecimalMin(value = "0.01", message = "O valor de vencimento não pode ser zero ou negativo")
    @Column(name = "valorVencimento", precision = 15, scale = 2)
    private BigDecimal valorVencimento;

    @jakarta.validation.constraints.NotNull(message = "A data de vencimento é obrigatória")
    private LocalDate dataVencimento;

    @Column(name = "valorRecebimento", precision = 15, scale = 2)
    private BigDecimal valorRecebimento;

    private LocalDate dataRecebimento;

    public ParcNota() {
    }

    public Long getCodParcNota() {
        return codParcNota;
    }

    public void setCodParcNota(Long codParcNota) {
        this.codParcNota = codParcNota;
    }

    public Nota getNota() {
        return nota;
    }

    public void setNota(Nota nota) {
        this.nota = nota;
    }

    public Integer getNumero() {
        return numero;
    }

    public void setNumero(Integer numero) {
        this.numero = numero;
    }

    public BigDecimal getValorVencimento() {
        return valorVencimento;
    }

    public void setValorVencimento(BigDecimal valorVencimento) {
        this.valorVencimento = valorVencimento;
    }

    public LocalDate getDataVencimento() {
        return dataVencimento;
    }

    public void setDataVencimento(LocalDate dataVencimento) {
        this.dataVencimento = dataVencimento;
    }

    public BigDecimal getValorRecebimento() {
        return valorRecebimento;
    }

    public void setValorRecebimento(BigDecimal valorRecebimento) {
        this.valorRecebimento = valorRecebimento;
    }

    public LocalDate getDataRecebimento() {
        return dataRecebimento;
    }

    public void setDataRecebimento(LocalDate dataRecebimento) {
        this.dataRecebimento = dataRecebimento;
    }
}
