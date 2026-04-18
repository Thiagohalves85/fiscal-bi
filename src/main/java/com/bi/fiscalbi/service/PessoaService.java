package com.bi.fiscalbi.service;

import com.bi.fiscalbi.domain.dto.request.PessoaRequest;
import com.bi.fiscalbi.domain.dto.response.PessoaResponse;
import com.bi.fiscalbi.domain.entity.Pessoa;
import com.bi.fiscalbi.mapper.PessoaMapper;
import com.bi.fiscalbi.repository.PessoaRepository;
import com.bi.fiscalbi.exception.ResourceNotFoundException;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PessoaService {

    private final PessoaRepository repository;
    private final PessoaMapper mapper;

    public PessoaService(PessoaRepository repository, PessoaMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional(readOnly = true)
    public List<PessoaResponse> listar() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PessoaResponse buscarPorId(@NonNull Long id) {
        return mapper.toResponse(findOrThrow(id));
    }

    @Transactional
    public PessoaResponse salvar(@NonNull PessoaRequest request) {
        Pessoa pessoa = mapper.toEntity(request);
        return mapper.toResponse(repository.save(pessoa));
    }

    @Transactional
    public void deletar(@NonNull Long id) {
        findOrThrow(id);
        repository.deleteById(id);
    }

    @Transactional
    public PessoaResponse atualizar(@NonNull Long id, PessoaRequest request) {
        Pessoa existente = findOrThrow(id);
        existente.setNome(request.getNome());
        existente.setEmail(request.getEmail());
        existente.setTelefone(request.getTelefone());
        return mapper.toResponse(repository.save(existente));
    }

    private Pessoa findOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pessoa não encontrada com id: " + id));
    }
}
