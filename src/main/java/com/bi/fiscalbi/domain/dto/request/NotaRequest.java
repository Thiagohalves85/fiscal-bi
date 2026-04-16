package com.bi.fiscalbi.domain.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class NotaRequest {

    @NotNull(message = "O cliente da nota é obrigatório")
    private Long codCliente;

    @NotNull(message = "A data de emissão é obrigatória")
    private LocalDate dataEmissao;

    @NotNull(message = "O valor total é obrigatório")
    @DecimalMin(value = "0.01", message = "O valor total não pode ser zero ou negativo")
    private BigDecimal valorTotal;

    @NotEmpty(message = "A nota deve ter pelo menos um item")
    @Valid
    private List<ItemNotaRequest> itens;

    @NotEmpty(message = "A nota deve ter pelo menos uma parcela")
    @Valid
    private List<ParcNotaRequest> parcelas;

    public NotaRequest() {}

    public Long getCodCliente() { return codCliente; }
    public void setCodCliente(Long codCliente) { this.codCliente = codCliente; }

    public LocalDate getDataEmissao() { return dataEmissao; }
    public void setDataEmissao(LocalDate dataEmissao) { this.dataEmissao = dataEmissao; }

    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }

    public List<ItemNotaRequest> getItens() { return itens; }
    public void setItens(List<ItemNotaRequest> itens) { this.itens = itens; }

    public List<ParcNotaRequest> getParcelas() { return parcelas; }
    public void setParcelas(List<ParcNotaRequest> parcelas) { this.parcelas = parcelas; }
}
