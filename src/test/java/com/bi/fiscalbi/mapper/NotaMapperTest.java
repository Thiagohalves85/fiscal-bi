package com.bi.fiscalbi.mapper;

import com.bi.fiscalbi.domain.dto.request.ItemNotaRequest;
import com.bi.fiscalbi.domain.dto.request.NotaRequest;
import com.bi.fiscalbi.domain.dto.request.ParcNotaRequest;
import com.bi.fiscalbi.domain.entity.Cliente;
import com.bi.fiscalbi.domain.entity.Nota;
import com.bi.fiscalbi.repository.ClienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class NotaMapperTest {

    @Mock
    private ClienteRepository clienteRepository;

    @Mock
    private ClienteMapper clienteMapper;

    @InjectMocks
    private NotaMapper notaMapper;

    private NotaRequest notaRequest;

    @BeforeEach
    void setUp() {
        notaRequest = new NotaRequest();
        notaRequest.setCodCliente(1L);
        notaRequest.setDataEmissao(LocalDate.now());
        notaRequest.setValorTotal(new BigDecimal("1500.50"));

        ItemNotaRequest item = new ItemNotaRequest();
        item.setValorUnitario(new BigDecimal("1500.50"));
        item.setQuantidade(1);
        notaRequest.setItens(List.of(item));

        ParcNotaRequest parc = new ParcNotaRequest();
        parc.setNumero(1);
        parc.setValorVencimento(new BigDecimal("1500.50"));
        parc.setDataVencimento(LocalDate.now().plusDays(30));
        notaRequest.setParcelas(List.of(parc));
    }

    @Test
    void toEntity_DeveConverterRequestEmEntity_Corretamente() {
        // Arrange
        Cliente mockCliente = new Cliente();
        mockCliente.setCodCliente(1L);
        mockCliente.setNome("Empresa Teste");
        when(clienteRepository.findById(1L)).thenReturn(Optional.of(mockCliente));

        // Act
        Nota result = notaMapper.toEntity(notaRequest);

        // Assert
        assertNotNull(result);
        assertEquals(mockCliente, result.getCliente());
        assertEquals(notaRequest.getValorTotal(), result.getValorTotal());
        assertEquals(1, result.getItens().size());
        assertEquals(1, result.getParcelas().size());

        // Verificar relacionamentos bidirecionais
        assertEquals(result, result.getItens().get(0).getNota());
        assertEquals(result, result.getParcelas().get(0).getNota());
    }

    @Test
    void toEntity_DeveLancarExcecao_QuandoClienteNaoExistir() {
        // Arrange
        when(clienteRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            notaMapper.toEntity(notaRequest);
        });

        assertTrue(exception.getMessage().contains("Cliente não encontrado com id: 1"));
    }
}
