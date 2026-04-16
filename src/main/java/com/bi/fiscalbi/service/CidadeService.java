package com.bi.fiscalbi.service;

import com.bi.fiscalbi.domain.dto.request.CidadeRequest;
import com.bi.fiscalbi.domain.dto.response.CidadeResponse;
import com.bi.fiscalbi.domain.entity.Cidade;
import com.bi.fiscalbi.exception.ResourceNotFoundException;
import com.bi.fiscalbi.mapper.CidadeMapper;
import com.bi.fiscalbi.repository.CidadeRepository;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CidadeService {
    private final CidadeRepository repository;
    private final CidadeMapper mapper;

    public CidadeService(CidadeRepository repository, CidadeMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<CidadeResponse> listar() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional
    public CidadeResponse salvar(@NonNull CidadeRequest request) {
        Cidade cidade = mapper.toEntity(request);
        return mapper.toResponse(repository.save(cidade));
    }

    @Transactional(readOnly = true)
    public CidadeResponse buscarPorId(@NonNull Long id) {
        return mapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public void deletar(@NonNull Long id) {
        findOrThrow(id);
        repository.deleteById(id);
    }

    @Transactional
    public CidadeResponse atualizar(@NonNull Long id, CidadeRequest request) {
        Cidade existente = findOrThrow(id);
        existente.setNome(request.getNome());
        existente.setUf(request.getUf());
        return mapper.toResponse(repository.save(existente));
    }

    private Cidade findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cidade não encontrada com id: " + id));
    }
}

