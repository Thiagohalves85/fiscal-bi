package com.bi.fiscalbi.mapper;

import com.bi.fiscalbi.domain.dto.request.NotaRequest;
import com.bi.fiscalbi.domain.dto.request.ItemNotaRequest;
import com.bi.fiscalbi.domain.dto.request.ParcNotaRequest;
import com.bi.fiscalbi.domain.dto.response.NotaResponse;
import com.bi.fiscalbi.domain.dto.response.ItemNotaResponse;
import com.bi.fiscalbi.domain.dto.response.ParcNotaResponse;
import com.bi.fiscalbi.domain.entity.Nota;
import com.bi.fiscalbi.domain.entity.ItemNota;
import com.bi.fiscalbi.domain.entity.ParcNota;
import com.bi.fiscalbi.exception.ResourceNotFoundException;
import com.bi.fiscalbi.repository.ClienteRepository;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class NotaMapper {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    public NotaMapper(ClienteRepository clienteRepository, ClienteMapper clienteMapper) {
        this.clienteRepository = clienteRepository;
        this.clienteMapper = clienteMapper;
    }

    public Nota toEntity(NotaRequest request) {
        Nota nota = new Nota();
        nota.setCliente(clienteRepository.findById(request.getCodCliente())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + request.getCodCliente())));
        nota.setDataEmissao(request.getDataEmissao());
        nota.setValorTotal(request.getValorTotal());

        List<ItemNota> itens = request.getItens().stream().map(r -> {
            ItemNota item = new ItemNota();
            item.setValorUnitario(r.getValorUnitario());
            item.setQuantidade(r.getQuantidade());
            item.setNota(nota);
            return item;
        }).toList();

        List<ParcNota> parcelas = request.getParcelas().stream().map(r -> {
            ParcNota parc = new ParcNota();
            parc.setNumero(r.getNumero());
            parc.setValorVencimento(r.getValorVencimento());
            parc.setDataVencimento(r.getDataVencimento());
            parc.setNota(nota);
            return parc;
        }).toList();

        nota.setItens(itens);
        nota.setParcelas(parcelas);
        return nota;
    }

    public NotaResponse toResponse(Nota nota) {
        List<ItemNotaResponse> itens = nota.getItens().stream().map(i ->
                new ItemNotaResponse(i.getCodItemNota(), i.getValorUnitario(), i.getQuantidade())
        ).toList();

        List<ParcNotaResponse> parcelas = nota.getParcelas().stream().map(p ->
                new ParcNotaResponse(
                        p.getCodParcNota(), p.getNumero(),
                        p.getValorVencimento(), p.getDataVencimento(),
                        p.getValorRecebimento(), p.getDataRecebimento()
                )
        ).toList();

        return new NotaResponse(
                nota.getCodNota(),
                clienteMapper.toResponse(nota.getCliente()),
                nota.getDataEmissao(),
                nota.getValorTotal(),
                itens,
                parcelas
        );
    }
}
