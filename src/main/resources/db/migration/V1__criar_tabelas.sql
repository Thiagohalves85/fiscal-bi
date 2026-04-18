CREATE TABLE cidades (
    cod_cidade BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    uf VARCHAR(2) NOT NULL
);

CREATE TABLE clientes (
    cod_cliente BIGSERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cod_cidade BIGINT NOT NULL,
    CONSTRAINT fk_cliente_cidade FOREIGN KEY (cod_cidade) REFERENCES cidades(cod_cidade)
);

CREATE TABLE notas (
    cod_nota BIGSERIAL PRIMARY KEY,
    cod_cliente BIGINT NOT NULL,
    data_emissao DATE NOT NULL,
    valor_total DECIMAL(15, 2) NOT NULL,
    CONSTRAINT fk_nota_cliente FOREIGN KEY (cod_cliente) REFERENCES clientes(cod_cliente)
);

CREATE TABLE item_notas (
    cod_item_nota BIGSERIAL PRIMARY KEY,
    cod_nota BIGINT NOT NULL,
    valor_unitario DECIMAL(15, 2) NOT NULL,
    quantidade INTEGER NOT NULL,
    CONSTRAINT fk_item_nota_nota FOREIGN KEY (cod_nota) REFERENCES notas(cod_nota)
);

CREATE TABLE parc_notas (
    cod_parc_nota BIGSERIAL PRIMARY KEY,
    cod_nota BIGINT NOT NULL,
    numero INTEGER NOT NULL,
    valor_vencimento DECIMAL(15, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    valor_recebimento DECIMAL(15, 2),
    data_recebimento DATE,
    CONSTRAINT fk_parc_nota_nota FOREIGN KEY (cod_nota) REFERENCES notas(cod_nota)
);

CREATE INDEX idx_cliente_cidade ON clientes(cod_cidade);
CREATE INDEX idx_pessoa_cliente ON pessoas(cod_cliente);
CREATE INDEX idx_nota_cliente ON notas(cod_cliente);
CREATE INDEX idx_item_nota ON item_notas(cod_nota);
CREATE INDEX idx_parc_nota ON parc_notas(cod_nota);

CREATE INDEX idx_cidade_uf ON cidades(uf);
CREATE INDEX idx_nota_data_emissao ON notas(data_emissao);
CREATE INDEX idx_parc_vencimento ON parc_notas(data_vencimento);
CREATE INDEX idx_parc_recebimento ON parc_notas(data_recebimento);
