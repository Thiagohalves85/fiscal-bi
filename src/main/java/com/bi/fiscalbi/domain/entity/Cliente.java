package com.bi.fiscalbi.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clientes")
public class Cliente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codCliente")
    private Long codCliente;

    @jakarta.validation.constraints.NotBlank(message = "O nome do cliente é obrigatório")
    @Column(nullable = false)
    private String nome;

    @jakarta.validation.constraints.NotNull(message = "A cidade do cliente é obrigatória")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codCidade", nullable = false)
    private Cidade cidade;

    public Cliente() {
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

    public Cidade getCidade() {
        return cidade;
    }

    public void setCidade(Cidade cidade) {
        this.cidade = cidade;
    }

}
