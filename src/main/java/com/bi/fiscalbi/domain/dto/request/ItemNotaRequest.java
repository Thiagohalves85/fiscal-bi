package com.bi.fiscalbi.domain.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class ItemNotaRequest {

    @NotNull(message = "O valor unitário é obrigatório")
    @DecimalMin(value = "0.01", message = "O valor unitário não pode ser zero ou negativo")
    private BigDecimal valorUnitario;

    @NotNull(message = "A quantidade é obrigatória")
    @Min(value = 1, message = "A quantidade deve ser maior ou igual a 1")
    private Integer quantidade;

    public ItemNotaRequest() {
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
