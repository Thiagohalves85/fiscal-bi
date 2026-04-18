package com.bi.fiscalbi.domain.dto.response;

import java.math.BigDecimal;

public class ItemNotaResponse {
    private Long codItemNota;
    private BigDecimal valorUnitario;
    private Integer quantidade;

    public ItemNotaResponse() {
    }

    public ItemNotaResponse(Long codItemNota, BigDecimal valorUnitario, Integer quantidade) {
        this.codItemNota = codItemNota;
        this.valorUnitario = valorUnitario;
        this.quantidade = quantidade;
    }

    public Long getCodItemNota() {
        return codItemNota;
    }

    public void setCodItemNota(Long codItemNota) {
        this.codItemNota = codItemNota;
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
