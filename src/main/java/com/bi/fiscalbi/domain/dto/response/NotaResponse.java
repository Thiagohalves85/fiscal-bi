package com.bi.fiscalbi.domain.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class NotaResponse {
    private Long codNota;
    private ClienteResponse cliente;
    private LocalDate dataEmissao;
    private BigDecimal valorTotal;
    private List<ItemNotaResponse> itens;
    private List<ParcNotaResponse> parcelas;

    public NotaResponse() {
    }

    public NotaResponse(Long codNota, ClienteResponse cliente, LocalDate dataEmissao,
            BigDecimal valorTotal, List<ItemNotaResponse> itens, List<ParcNotaResponse> parcelas) {
        this.codNota = codNota;
        this.cliente = cliente;
        this.dataEmissao = dataEmissao;
        this.valorTotal = valorTotal;
        this.itens = itens;
        this.parcelas = parcelas;
    }

    public Long getCodNota() {
        return codNota;
    }

    public void setCodNota(Long codNota) {
        this.codNota = codNota;
    }

    public ClienteResponse getCliente() {
        return cliente;
    }

    public void setCliente(ClienteResponse cliente) {
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

    public List<ItemNotaResponse> getItens() {
        return itens;
    }

    public void setItens(List<ItemNotaResponse> itens) {
        this.itens = itens;
    }

    public List<ParcNotaResponse> getParcelas() {
        return parcelas;
    }

    public void setParcelas(List<ParcNotaResponse> parcelas) {
        this.parcelas = parcelas;
    }
}
