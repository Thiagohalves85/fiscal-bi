package com.bi.fiscalbi.mapper;

import com.bi.fiscalbi.domain.dto.request.ClienteRequest;
import com.bi.fiscalbi.domain.dto.response.ClienteResponse;
import com.bi.fiscalbi.domain.entity.Cliente;
import com.bi.fiscalbi.exception.ResourceNotFoundException;
import com.bi.fiscalbi.repository.CidadeRepository;
import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    private final CidadeRepository cidadeRepository;
    private final CidadeMapper cidadeMapper;

    public ClienteMapper(CidadeRepository cidadeRepository, CidadeMapper cidadeMapper) {
        this.cidadeRepository = cidadeRepository;
        this.cidadeMapper = cidadeMapper;
    }

    public Cliente toEntity(ClienteRequest request) {
        Cliente cliente = new Cliente();
        cliente.setNome(request.getNome());
        cliente.setCidade(cidadeRepository.findById(request.getCodCidade())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cidade não encontrada com id: " + request.getCodCidade())));
        return cliente;
    }

    public ClienteResponse toResponse(Cliente cliente) {
        return new ClienteResponse(
                cliente.getCodCliente(),
                cliente.getNome(),
                cidadeMapper.toResponse(cliente.getCidade()));
    }
}
