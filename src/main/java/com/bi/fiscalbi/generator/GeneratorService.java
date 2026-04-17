package com.bi.fiscalbi.generator;

import com.bi.fiscalbi.domain.entity.Cliente;
import com.bi.fiscalbi.domain.entity.Cidade;
import com.bi.fiscalbi.domain.entity.Nota;
import com.bi.fiscalbi.repository.ClienteRepository;
import com.bi.fiscalbi.repository.CidadeRepository;
import com.bi.fiscalbi.repository.NotaRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import com.bi.fiscalbi.exception.ResourceNotFoundException;

@Service
public class GeneratorService {
    private final NotaRepository notaRepository;
    private final ClienteRepository clienteRepository;
    private final CidadeRepository cidadeRepository;
    private final GeneratorFactory generatorFactory;

    private static final int BATCH_SIZE = 1000;

    @PersistenceContext
    private EntityManager em;

    public GeneratorService(NotaRepository notaRepository,
            ClienteRepository clienteRepository,
            CidadeRepository cidadeRepository,
            GeneratorFactory generatorFactory) {
        this.notaRepository = notaRepository;
        this.clienteRepository = clienteRepository;
        this.cidadeRepository = cidadeRepository;
        this.generatorFactory = generatorFactory;
    }

    public void gerarParalelo(int totalNotas, Long codCliente) {

        int threads = 4;
        ExecutorService executor = Executors.newFixedThreadPool(threads);

        int notasPorThread = totalNotas / threads;

        for (int i = 0; i < threads; i++) {

            executor.submit(() -> {
                gerar(notasPorThread, codCliente);
            });
        }

        executor.shutdown();
    }

    public void gerar(int totalNotas, Long codCliente) {

        List<Cliente> clientes;

        if (codCliente != null) {
            Cliente cliente = clienteRepository.findById(codCliente)
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + codCliente));
            clientes = List.of(cliente);
        } else {
            clientes = clienteRepository.findAll();
        }

        if (clientes.isEmpty()) {
            gerarDadosMestresIniciais();
            clientes = clienteRepository.findAll();
        }

        for (int i = 0; i < totalNotas; i += BATCH_SIZE) {

            List<Nota> lote = gerarLote(clientes, BATCH_SIZE);

            notaRepository.saveAll(lote);

            flushAndClear();
        }
    }

    private List<Nota> gerarLote(List<Cliente> clientes, int tamanho) {

        List<Nota> notas = new ArrayList<>(tamanho);
        Random random = new Random();

        for (int i = 0; i < tamanho; i++) {

            Cliente cliente = clientes.get(random.nextInt(clientes.size()));

            Nota nota = generatorFactory.criarNota(cliente);

            notas.add(nota);
        }

        return notas;
    }

    private synchronized void gerarDadosMestresIniciais() {
        if (clienteRepository.count() > 0)
            return;

        List<Cidade> novasCidades = generatorFactory.gerarCidades(5);
        cidadeRepository.saveAll(novasCidades);

        List<Cliente> novosClientes = generatorFactory.gerarClientes(20, novasCidades);
        clienteRepository.saveAll(novosClientes);

        flushAndClear();
    }

    private void flushAndClear() {
        em.flush();
        em.clear();
    }
}
