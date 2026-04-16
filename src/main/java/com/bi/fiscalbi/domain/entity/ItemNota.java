package com.bi.fiscalbi.domain.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "itemNotas")
public class ItemNota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codItemNota")
    private Long codItemNota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codNota", nullable = false)
    private Nota nota;

    @jakarta.validation.constraints.NotNull(message = "O valor unitário é obrigatório")
    @jakarta.validation.constraints.DecimalMin(value = "0.01", message = "O valor unitário não pode ser zero ou negativo")
    @Column(name = "valorUnitario", precision = 15, scale = 2)
    private BigDecimal valorUnitario;

    @jakarta.validation.constraints.NotNull(message = "A quantidade é obrigatória")
    @jakarta.validation.constraints.Min(value = 1, message = "A quantidade deve ser maior ou igual a 1")
    @Column(nullable = false)
    private Integer quantidade;

    public ItemNota() {
    }

    public Long getCodItemNota() {
        return codItemNota;
    }

    public void setCodItemNota(Long codItemNota) {
        this.codItemNota = codItemNota;
    }

    public Nota getNota() {
        return nota;
    }

    public void setNota(Nota nota) {
        this.nota = nota;
    }

    public BigDecimal getValorUnitario() {
        return valorUnitario;
    }

    public void setValorUnitario(BigDecimal valorUnitario) {
        this.valorUnitario = valorUnitario;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}