package com.bi.fiscalbi.mapper;

import com.bi.fiscalbi.domain.dto.request.PessoaRequest;
import com.bi.fiscalbi.domain.dto.response.PessoaResponse;
import com.bi.fiscalbi.domain.entity.Cliente;
import com.bi.fiscalbi.domain.entity.Pessoa;
import com.bi.fiscalbi.repository.ClienteRepository;

public class PessoaMapper {
    private final ClienteRepository repository;

    public PessoaMapper(ClienteRepository repository) {
        this.repository = repository;
    }

    public Pessoa toEntity(PessoaRequest request) {
        Pessoa pessoa = new Pessoa();
        pessoa.setNome(request.getNome());
        pessoa.setEmail(request.getEmail());
        pessoa.setTelefone(request.getTelefone());

        Cliente cliente = repository.findById(request.getCodCliente())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
        pessoa.setCliente(cliente);

        return pessoa;
    }

    public PessoaResponse toResponse(Pessoa pessoa) {
        PessoaResponse response = new PessoaResponse();
        response.setCodPessoa(pessoa.getCodPessoa());
        response.setNome(pessoa.getNome());
        response.setEmail(pessoa.getEmail());
        response.setTelefone(pessoa.getTelefone());
        return response;
    }

}
