package com.bi.fiscalbi.controller;

import com.bi.fiscalbi.domain.dto.request.ClienteRequest;
import com.bi.fiscalbi.domain.dto.response.ClienteResponse;
import com.bi.fiscalbi.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> buscar(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> criar(@RequestBody @Valid ClienteRequest request) {
        return ResponseEntity.ok(service.salvar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> atualizar(@PathVariable @NonNull Long id,
                                                      @RequestBody @Valid ClienteRequest request) {
        return ResponseEntity.ok(service.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable @NonNull Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

