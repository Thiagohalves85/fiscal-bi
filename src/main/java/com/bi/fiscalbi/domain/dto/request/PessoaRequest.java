package com.bi.fiscalbi.domain.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PessoaRequest {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;
    private String email;
    private String telefone;
    @NotNull(message = "O cliente é obrigatório")
    private Long codCliente;

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public void setCodCliente(Long codCliente) {
        this.codCliente = codCliente;
    }

    public String getNome() {
        return nome;
    }

    public String getEmail() {
        return email;
    }

    public String getTelefone() {
        return telefone;
    }

    public Long getCodCliente() {
        return codCliente;
    }

}
