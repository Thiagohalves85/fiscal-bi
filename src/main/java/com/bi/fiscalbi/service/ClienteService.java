package com.bi.fiscalbi.service;

import com.bi.fiscalbi.domain.dto.request.ClienteRequest;
import com.bi.fiscalbi.domain.dto.response.ClienteResponse;
import com.bi.fiscalbi.domain.entity.Cliente;
import com.bi.fiscalbi.exception.ResourceNotFoundException;
import com.bi.fiscalbi.mapper.ClienteMapper;
import com.bi.fiscalbi.repository.ClienteRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClienteService {
    private final ClienteRepository repository;
    private final ClienteMapper mapper;

    public ClienteService(ClienteRepository repository, ClienteMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<ClienteResponse> listar() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public ClienteResponse salvar(@NonNull ClienteRequest request) {
        Cliente cliente = mapper.toEntity(request);
        return mapper.toResponse(repository.save(cliente));
    }

    @Transactional(readOnly = true)
    public ClienteResponse buscarPorId(@NonNull Long id) {
        return mapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public void deletar(@NonNull Long id) {
        findOrThrow(id);
        repository.deleteById(id);
    }

    @Transactional
    public ClienteResponse atualizar(@NonNull Long id, ClienteRequest request) {
        Cliente existente = findOrThrow(id);
        existente.setNome(request.getNome());
        existente.setCidade(mapper.toEntity(request).getCidade());
        return mapper.toResponse(repository.save(existente));
    }

    private Cliente findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
    }
}

