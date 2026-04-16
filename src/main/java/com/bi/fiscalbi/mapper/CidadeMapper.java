package com.bi.fiscalbi.mapper;

import com.bi.fiscalbi.domain.dto.request.CidadeRequest;
import com.bi.fiscalbi.domain.dto.response.CidadeResponse;
import com.bi.fiscalbi.domain.entity.Cidade;
import org.springframework.stereotype.Component;

@Component
public class CidadeMapper {

    public Cidade toEntity(CidadeRequest request) {
        Cidade cidade = new Cidade();
        cidade.setNome(request.getNome());
        cidade.setUf(request.getUf());
        return cidade;
    }

    public CidadeResponse toResponse(Cidade cidade) {
        return new CidadeResponse(
                cidade.getCodCidade(),
                cidade.getNome(),
                cidade.getUf()
        );
    }
}
