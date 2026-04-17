package com.bi.fiscalbi.controller;

import com.bi.fiscalbi.domain.dto.request.NotaRequest;
import com.bi.fiscalbi.domain.dto.response.NotaResponse;
import com.bi.fiscalbi.service.NotaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotaController.class)
public class NotaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private NotaService notaService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void criar_DeveRetornarCreated_ComNotaValida() throws Exception {
        // Arrange
        NotaRequest request = new NotaRequest();
        request.setCodCliente(1L);
        request.setDataEmissao(LocalDate.now());
        request.setValorTotal(new BigDecimal("100.00"));

        com.bi.fiscalbi.domain.dto.request.ItemNotaRequest item = new com.bi.fiscalbi.domain.dto.request.ItemNotaRequest();
        item.setValorUnitario(new BigDecimal("100.00"));
        item.setQuantidade(1);
        request.setItens(java.util.List.of(item));

        com.bi.fiscalbi.domain.dto.request.ParcNotaRequest parc = new com.bi.fiscalbi.domain.dto.request.ParcNotaRequest();
        parc.setNumero(1);
        parc.setValorVencimento(new BigDecimal("100.00"));
        parc.setDataVencimento(LocalDate.now().plusDays(30));
        request.setParcelas(java.util.List.of(parc));

        NotaResponse response = new NotaResponse(
                1L, null, LocalDate.now(), new BigDecimal("100.00"),
                Collections.emptyList(), Collections.emptyList());

        when(notaService.salvar(any(NotaRequest.class))).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/notas")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codNota").value(1L))
                .andExpect(jsonPath("$.valorTotal").value(100.00));
    }

    @Test
    void buscar_DeveRetornarOk_QuandoNotaExistir() throws Exception {
        // Arrange
        NotaResponse response = new NotaResponse(
                1L, null, LocalDate.now(), new BigDecimal("500.00"),
                Collections.emptyList(), Collections.emptyList());

        when(notaService.buscarPorId(1L)).thenReturn(response);

        // Act & Assert
        mockMvc.perform(get("/api/notas/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codNota").value(1L))
                .andExpect(jsonPath("$.valorTotal").value(500.00));
    }
}
