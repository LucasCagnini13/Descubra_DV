#ifndef HASH_H
#define HASH_H

typedef struct NoHash
{
    int produtoCodigo;
    struct NoHash *proximo;
} NoHash;

typedef struct
{
    NoHash **listaBuckets;
    int tabelaTamanho;
} TabelaHash;

/*
 * Cria uma tabela hash.
 */
TabelaHash *hashCriar(
    int tabelaTamanho);

/*
 * Calcula o índice do bucket.
 */
int hashCalcularIndice(
    int produtoCodigo,
    int tabelaTamanho);

/*
 * Insere um código na hash.
 */
void hashInserir(
    TabelaHash *hashTabela,
    int produtoCodigo);

/*
 * Busca um código na hash.
 * Retorna:
 * 1 -> encontrado
 * 0 -> não encontrado
 */
int hashBuscar(
    TabelaHash *hashTabela,
    int produtoCodigo,
    long *buscaComparacoes);

/*
 * Libera a memória da hash.
 */
void hashLiberar(
    TabelaHash *hashTabela);

#endif