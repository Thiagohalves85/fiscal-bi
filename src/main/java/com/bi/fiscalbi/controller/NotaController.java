package com.bi.fiscalbi.controller;

import com.bi.fiscalbi.domain.dto.request.NotaRequest;
import com.bi.fiscalbi.domain.dto.response.NotaResponse;
import com.bi.fiscalbi.service.NotaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService notaService;

    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping
    public ResponseEntity<NotaResponse> criar(@RequestBody @Valid NotaRequest request) {
        return ResponseEntity.ok(notaService.salvar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaResponse> buscar(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(notaService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<NotaResponse>> listar(
            @RequestParam(required = false) Long codCliente,
            @RequestParam(required = false) Long codCidade) {

        if (codCliente != null) {
            return ResponseEntity.ok(notaService.listarPorCliente(codCliente));
        }
        if (codCidade != null) {
            return ResponseEntity.ok(notaService.listarPorCidade(codCidade));
        }
        return ResponseEntity.ok(notaService.listar());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable @NonNull Long id) {
        notaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

