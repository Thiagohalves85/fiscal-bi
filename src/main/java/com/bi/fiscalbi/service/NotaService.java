package com.bi.fiscalbi.service;

import com.bi.fiscalbi.domain.dto.request.NotaRequest;
import com.bi.fiscalbi.domain.dto.response.NotaResponse;
import com.bi.fiscalbi.domain.entity.*;
import com.bi.fiscalbi.exception.BusinessException;
import com.bi.fiscalbi.exception.ResourceNotFoundException;
import com.bi.fiscalbi.mapper.NotaMapper;
import com.bi.fiscalbi.repository.NotaRepository;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class NotaService {
    private final NotaRepository notaRepository;
    private final NotaMapper notaMapper;

    public NotaService(NotaRepository notaRepository, NotaMapper notaMapper) {
        this.notaRepository = notaRepository;
        this.notaMapper = notaMapper;
    }

    @Transactional
    public NotaResponse salvar(@NonNull NotaRequest request) {
        Nota nota = notaMapper.toEntity(request);
        validarNota(nota);
        return notaMapper.toResponse(notaRepository.save(nota));
    }

    @Transactional(readOnly = true)
    public NotaResponse buscarPorId(@NonNull Long id) {
        return notaMapper.toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<NotaResponse> listar() {
        return notaRepository.findAll().stream()
                .map(notaMapper::toResponse)
                .toList();
    }

    public void deletar(@NonNull Long id) {
        findOrThrow(id);
        notaRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<NotaResponse> listarPorCliente(@NonNull Long codCliente) {
        return notaRepository.findByClienteCodCliente(codCliente).stream()
                .map(notaMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<NotaResponse> listarPorCidade(@NonNull Long codCidade) {
        return notaRepository.findByClienteCidadeCodCidade(codCidade).stream()
                .map(notaMapper::toResponse)
                .toList();
    }

    private void validarNota(Nota nota) {

        BigDecimal totalItens = nota.getItens().stream()
                .map(i -> i.getValorUnitario()
                        .multiply(BigDecimal.valueOf(i.getQuantidade())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalItens.compareTo(nota.getValorTotal()) != 0) {
            throw new BusinessException("Total dos itens difere do valor da nota");
        }

        BigDecimal totalParcelas = nota.getParcelas().stream()
                .map(ParcNota::getValorVencimento)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (totalParcelas.compareTo(nota.getValorTotal()) != 0) {
            throw new BusinessException("Total das parcelas difere do valor da nota");
        }
    }

    private Nota findOrThrow(Long id) {
        return notaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Nota não encontrada com id: " + id));
    }
}
