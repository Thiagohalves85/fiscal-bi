package com.bi.fiscalbi.controller;

import com.bi.fiscalbi.domain.dto.request.CidadeRequest;
import com.bi.fiscalbi.domain.dto.response.CidadeResponse;
import com.bi.fiscalbi.service.CidadeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cidades")
public class CidadeController {
    private final CidadeService service;

    public CidadeController(CidadeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<CidadeResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CidadeResponse> buscar(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<CidadeResponse> criar(@RequestBody @Valid CidadeRequest request) {
        return ResponseEntity.ok(service.salvar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CidadeResponse> atualizar(@PathVariable @NonNull Long id,
                                                     @RequestBody @Valid CidadeRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable @NonNull Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

