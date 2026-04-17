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

    private static final String[] UFS_REAIS = { "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
            "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO" };
    private static final String[] PREFIXOS_EMPRESA = { "Comercial", "Varejo", "Indústria", "Distribuidora", "Serviços",
            "Tech", "Logística" };
    private static final String[] SUFIXOS_EMPRESA = { "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira",
            "Alves", "Global", "Express", "Brasil" };
    private static final String[] PREFIXOS_CIDADE = { "Nova", "São", "Santa", "Vila", "Bom", "Bela", "Porto", "Rio" };
    private static final String[] SUFIXOS_CIDADE = { "Esperança", "Vista", "Cruz", "José", "Claro", "Alegre", "Verde",
            "Sul" };

    public List<Cidade> gerarCidades(int quantidade) {
        List<Cidade> cidades = new ArrayList<>();
        for (int i = 0; i < quantidade; i++) {
            Cidade cidade = new Cidade();
            String nomeCidade = PREFIXOS_CIDADE[random.nextInt(PREFIXOS_CIDADE.length)] + " " +
                    SUFIXOS_CIDADE[random.nextInt(SUFIXOS_CIDADE.length)] + " " + i;
            String uf = UFS_REAIS[random.nextInt(UFS_REAIS.length)];

            cidade.setNome(nomeCidade);
            cidade.setUf(uf);
            cidades.add(cidade);
        }
        return cidades;
    }

    public List<Cliente> gerarClientes(int quantidade, List<Cidade> cidades) {
        List<Cliente> clientes = new ArrayList<>();
        for (int i = 0; i < quantidade; i++) {
            Cliente cliente = new Cliente();
            String nomeEmpresa = PREFIXOS_EMPRESA[random.nextInt(PREFIXOS_EMPRESA.length)] + " " +
                    SUFIXOS_EMPRESA[random.nextInt(SUFIXOS_EMPRESA.length)] + " LTDA " + i;
            Cidade cidadeAleatoria = cidades.get(random.nextInt(cidades.size()));

            cliente.setNome(nomeEmpresa);
            cliente.setCidade(cidadeAleatoria);
            clientes.add(cliente);
        }
        return clientes;
    }

    private LocalDate gerarData() {
        return LocalDate.now().minusDays(random.nextInt(365));
    }
}
