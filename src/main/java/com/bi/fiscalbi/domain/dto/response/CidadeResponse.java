package com.bi.fiscalbi.domain.dto.response;

public class CidadeResponse {
    private Long codCidade;
    private String nome;
    private String uf;

    public CidadeResponse() {
    }

    public CidadeResponse(Long codCidade, String nome, String uf) {
        this.codCidade = codCidade;
        this.nome = nome;
        this.uf = uf;
    }

    public Long getCodCidade() {
        return codCidade;
    }

    public void setCodCidade(Long codCidade) {
        this.codCidade = codCidade;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUf() {
        return uf;
    }

    public void setUf(String uf) {
        this.uf = uf;
    }
}
