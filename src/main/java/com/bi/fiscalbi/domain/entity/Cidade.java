package com.bi.fiscalbi.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cidades")
public class Cidade {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codCidade")
    private Long codCidade;

    @jakarta.validation.constraints.NotBlank(message = "O nome da cidade é obrigatório")
    @Column(nullable = false)
    private String nome;

    @jakarta.validation.constraints.NotBlank(message = "A UF da cidade é obrigatória")
    @jakarta.validation.constraints.Size(min = 2, max = 2, message = "A UF deve ter 2 caracteres")
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
