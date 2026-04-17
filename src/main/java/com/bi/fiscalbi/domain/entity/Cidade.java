package com.bi.fiscalbi.domain.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "cidades")
public class Cidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codCidade")
    private Long codCidade;

    @NotBlank(message = "O nome da cidade é obrigatório")
    @Column(nullable = false)
    private String nome;

    @NotBlank(message = "A UF da cidade é obrigatória")
    @Size(min = 2, max = 2, message = "A UF deve ter 2 caracteres")
    @Column(nullable = false, length = 2)
    private String uf;

    public Cidade() {
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
