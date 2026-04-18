package com.bi.fiscalbi.domain.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ParcNotaRequest {

    @NotNull(message = "O número da parcela é obrigatório")
    @Min(value = 1, message = "O número da parcela deve ser maior ou igual a 1")
    private Integer numero;

    @NotNull(message = "O valor de vencimento é obrigatório")
    @DecimalMin(value = "0.01", message = "O valor de vencimento não pode ser zero ou negativo")
    private BigDecimal valorVencimento;

    @NotNull(message = "A data de vencimento é obrigatória")
    private LocalDate dataVencimento;

    public ParcNotaRequest() {
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
}
