package com.bi.fiscalbi.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CidadeRequest {

    @NotBlank(message = "O nome da cidade é obrigatório")
    private String nome;

    @NotBlank(message = "A UF é obrigatória")
    @Size(min = 2, max = 2, message = "A UF deve ter exatamente 2 caracteres")
    private String uf;

    public CidadeRequest() {}

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }
}
