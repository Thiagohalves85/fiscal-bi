package com.bi.fiscalbi.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ClienteRequest {

    @NotBlank(message = "O nome do cliente é obrigatório")
    private String nome;

    @NotNull(message = "A cidade do cliente é obrigatória")
    private Long codCidade;

    public ClienteRequest() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public Long getCodCidade() { return codCidade; }
    public void setCodCidade(Long codCidade) { this.codCidade = codCidade; }
}
