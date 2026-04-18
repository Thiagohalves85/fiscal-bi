package com.bi.fiscalbi.domain.dto.response;

public class ClienteResponse {
    private Long codCliente;
    private String nome;
    private CidadeResponse cidade;

    public ClienteResponse() {
    }

    public ClienteResponse(Long codCliente, String nome, CidadeResponse cidade) {
        this.codCliente = codCliente;
        this.nome = nome;
        this.cidade = cidade;
    }

    public Long getCodCliente() {
        return codCliente;
    }

    public void setCodCliente(Long codCliente) {
        this.codCliente = codCliente;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public CidadeResponse getCidade() {
        return cidade;
    }

    public void setCidade(CidadeResponse cidade) {
        this.cidade = cidade;
    }
}
