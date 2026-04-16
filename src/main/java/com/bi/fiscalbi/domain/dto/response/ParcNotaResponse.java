package com.bi.fiscalbi.domain.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ParcNotaResponse {
    private Long codParcNota;
    private Integer numero;
    private BigDecimal valorVencimento;
    private LocalDate dataVencimento;
    private BigDecimal valorRecebimento;
    private LocalDate dataRecebimento;

    public ParcNotaResponse() {}

    public ParcNotaResponse(Long codParcNota, Integer numero, BigDecimal valorVencimento,
                             LocalDate dataVencimento, BigDecimal valorRecebimento, LocalDate dataRecebimento) {
        this.codParcNota = codParcNota;
        this.numero = numero;
        this.valorVencimento = valorVencimento;
        this.dataVencimento = dataVencimento;
        this.valorRecebimento = valorRecebimento;
        this.dataRecebimento = dataRecebimento;
    }

    public Long getCodParcNota() { return codParcNota; }
    public void setCodParcNota(Long codParcNota) { this.codParcNota = codParcNota; }

    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }

    public BigDecimal getValorVencimento() { return valorVencimento; }
    public void setValorVencimento(BigDecimal valorVencimento) { this.valorVencimento = valorVencimento; }

    public LocalDate getDataVencimento() { return dataVencimento; }
    public void setDataVencimento(LocalDate dataVencimento) { this.dataVencimento = dataVencimento; }

    public BigDecimal getValorRecebimento() { return valorRecebimento; }
    public void setValorRecebimento(BigDecimal valorRecebimento) { this.valorRecebimento = valorRecebimento; }

    public LocalDate getDataRecebimento() { return dataRecebimento; }
    public void setDataRecebimento(LocalDate dataRecebimento) { this.dataRecebimento = dataRecebimento; }
}
