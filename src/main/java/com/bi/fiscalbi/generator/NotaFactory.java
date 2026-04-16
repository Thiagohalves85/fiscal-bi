package com.bi.fiscalbi.generator;

import com.bi.fiscalbi.domain.entity.*;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class NotaFactory {
    private final Random random = new Random();

    public Nota criarNota(Cliente cliente) {

        Nota nota = new Nota();

        nota.setCliente(cliente);
        nota.setDataEmissao(gerarData());

        List<ItemNota> itens = gerarItens(nota);
        BigDecimal total = calcularTotalItens(itens);

        List<ParcNota> parcelas = gerarParcelas(nota, total);

        nota.setItens(itens);
        nota.setParcelas(parcelas);
        nota.setValorTotal(total);

        return nota;
    }

    private List<ItemNota> gerarItens(Nota nota) {

        int quantidadeItens = random.nextInt(5) + 1;

        List<ItemNota> itens = new ArrayList<>();

        for (int i = 0; i < quantidadeItens; i++) {

            ItemNota item = new ItemNota();

            item.setNota(nota);
            item.setQuantidade(random.nextInt(10) + 1);
            item.setValorUnitario(gerarValor());

            itens.add(item);
        }

        return itens;
    }

    private List<ParcNota> gerarParcelas(Nota nota, BigDecimal total) {

        int qtdParcelas = random.nextInt(3) + 1;

        List<ParcNota> parcelas = new ArrayList<>();

        BigDecimal valorParcela = total.divide(
                BigDecimal.valueOf(qtdParcelas),
                2,
                RoundingMode.HALF_UP);

        BigDecimal acumulado = BigDecimal.ZERO;

        for (int i = 1; i <= qtdParcelas; i++) {

            ParcNota parcela = new ParcNota();

            parcela.setNota(nota);
            parcela.setNumero(i);
            parcela.setDataVencimento(LocalDate.now().plusDays(i * 30));
            if (i == qtdParcelas) {
                parcela.setValorVencimento(total.subtract(acumulado));
            } else {
                parcela.setValorVencimento(valorParcela);
                acumulado = acumulado.add(valorParcela);
            }

            // Simula pagamento (50% chance)
            if (random.nextBoolean()) {
                parcela.setValorRecebimento(parcela.getValorVencimento());
                parcela.setDataRecebimento(parcela.getDataVencimento());
            }

            parcelas.add(parcela);
        }

        return parcelas;
    }

    private BigDecimal calcularTotalItens(List<ItemNota> itens) {

        BigDecimal total = BigDecimal.ZERO;

        for (ItemNota item : itens) {
            BigDecimal valor = item.getValorUnitario()
                    .multiply(BigDecimal.valueOf(item.getQuantidade()));

            total = total.add(valor);
        }

        return total.setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal gerarValor() {
        double valor = 10 + (100 * random.nextDouble());
        return BigDecimal.valueOf(valor).setScale(2, RoundingMode.HALF_UP);
    }

    private LocalDate gerarData() {
        return LocalDate.now().minusDays(random.nextInt(365));
    }
}
