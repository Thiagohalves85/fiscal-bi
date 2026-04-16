package com.bi.fiscalbi.domain.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "notas")
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codNota")
    private Long codNota;

    @jakarta.validation.constraints.NotNull(message = "O cliente da nota é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codCliente", nullable = false)
    private Cliente cliente;

    @jakarta.validation.constraints.NotNull(message = "A data de emissão é obrigatória")
    @Column(name = "dataEmissao", nullable = false)
    private LocalDate dataEmissao;

    @jakarta.validation.constraints.NotNull(message = "O valor total é obrigatório")
    @jakarta.validation.constraints.DecimalMin(value = "0.01", message = "O valor não pode ser zero ou negativo")
    @Column(name = "valorTotal", precision = 15, scale = 2, nullable = false)
    private BigDecimal valorTotal;

    @OneToMany(mappedBy = "nota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemNota> itens;

    @OneToMany(mappedBy = "nota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ParcNota> parcelas;

    public Nota() {
    }

    public Long getCodNota() {
        return codNota;
    }

    public void setCodNota(Long codNota) {
        this.codNota = codNota;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public LocalDate getDataEmissao() {
        return dataEmissao;
    }

    public void setDataEmissao(LocalDate dataEmissao) {
        this.dataEmissao = dataEmissao;
    }

    public BigDecimal getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(BigDecimal valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<ItemNota> getItens() {
        return itens;
    }

    public void setItens(List<ItemNota> itens) {
        this.itens = itens;
    }

    public List<ParcNota> getParcelas() {
        return parcelas;
    }

    public void setParcelas(List<ParcNota> parcelas) {
        this.parcelas = parcelas;
    }
}