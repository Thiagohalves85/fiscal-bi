package com.bi.fiscalbi.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bi.fiscalbi.generator.GeneratorService;

@RestController
@RequestMapping("/api/generator")
public class GeneratorController {
    private final GeneratorService generatorService;

    public GeneratorController(GeneratorService generatorService) {
        this.generatorService = generatorService;
    }

    @PostMapping
    public ResponseEntity<String> gerar(
            @RequestParam int quantidade,
            @RequestParam(required = false) Long codCliente) {

        generatorService.gerarParalelo(quantidade, codCliente);

        String msg = codCliente != null
                ? "Geração de " + quantidade + " notas iniciada para o cliente " + codCliente
                : "Geração de " + quantidade + " notas iniciada para todos os clientes";

        return ResponseEntity.ok(msg);
    }
}
