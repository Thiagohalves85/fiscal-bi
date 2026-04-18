package com.bi.fiscalbi.domain.dto.response;

public class PessoaResponse {
    private Long codPessoa;
    private String nome;
    private String email;
    private String telefone;

    public PessoaResponse() {
    }

    public PessoaResponse(Long codPessoa, String nome, String email, String telefone) {
        this.codPessoa = codPessoa;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    public Long getCodPessoa() {
        return codPessoa;
    }

    public void setCodPessoa(Long codPessoa) {
        this.codPessoa = codPessoa;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }
}
