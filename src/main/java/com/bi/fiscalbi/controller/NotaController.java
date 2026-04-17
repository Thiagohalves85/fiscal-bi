package com.bi.fiscalbi.controller;

import com.bi.fiscalbi.domain.dto.request.NotaRequest;
import com.bi.fiscalbi.domain.dto.response.NotaResponse;
import com.bi.fiscalbi.service.NotaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

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
    public ResponseEntity<Page<NotaResponse>> listar(
            @RequestParam(required = false) Long codCliente,
            @RequestParam(required = false) Long codCidade,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "codNota", direction = Sort.Direction.DESC) Pageable pageable) {

        if (codCliente != null) {
            return ResponseEntity.ok(notaService.listarPorCliente(codCliente, pageable));
        }
        if (codCidade != null) {
            return ResponseEntity.ok(notaService.listarPorCidade(codCidade, pageable));
        }
        return ResponseEntity.ok(notaService.listar(pageable, search));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(notaService.getEstatisticas());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable @NonNull Long id) {
        notaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

