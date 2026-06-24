#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "abb.h"
#include "hash.h"
#include "gerador.h"
#include "experimento.h"

#define QUANTIDADE_BUSCAS 1000000

static void experimentoBuscarABBExistentes(
    NoArvore *arvoreRaiz,
    int *produtoCodigos,
    int produtoQuantidade);

static void experimentoBuscarHashExistentes(
    TabelaHash *hashTabela,
    int *produtoCodigos,
    int produtoQuantidade);

static void experimentoBuscarABBInexistentes(
    NoArvore *arvoreRaiz);

static void experimentoBuscarHashInexistentes(
    TabelaHash *hashTabela);

void experimentoExecutar(
    int produtoQuantidade)
{
    printf("\n");
    printf("====================================================\n");
    printf("TAMANHO: %d\n", produtoQuantidade);
    printf("====================================================\n");

    int *produtoCodigos =
        produtoGerarCodigos(
            produtoQuantidade);

    NoArvore *arvoreRaiz = NULL;

    TabelaHash *hashTabela =
        hashCriar(
            produtoQuantidade * 2);

    for (
        int indice = 0;
        indice < produtoQuantidade;
        indice++)
    {
        arvoreRaiz =
            arvoreInserir(
                arvoreRaiz,
                produtoCodigos[indice]);

        hashInserir(
            hashTabela,
            produtoCodigos[indice]);
    }

    printf("\nBUSCAS EXISTENTES\n\n");

    experimentoBuscarABBExistentes(
        arvoreRaiz,
        produtoCodigos,
        produtoQuantidade);

    experimentoBuscarHashExistentes(
        hashTabela,
        produtoCodigos,
        produtoQuantidade);

    printf("\nBUSCAS INEXISTENTES\n\n");

    experimentoBuscarABBInexistentes(
        arvoreRaiz);

    experimentoBuscarHashInexistentes(
        hashTabela);

    arvoreLiberar(arvoreRaiz);
    hashLiberar(hashTabela);

    free(produtoCodigos);
}

static void experimentoBuscarABBExistentes(
    NoArvore *arvoreRaiz,
    int *produtoCodigos,
    int produtoQuantidade)
{
    long buscaComparacoes = 0;

    clock_t tempoInicio = clock();

    for (
        int buscaIndice = 0;
        buscaIndice < QUANTIDADE_BUSCAS;
        buscaIndice++)
    {
        int codigoBusca =
            produtoCodigos[rand() % produtoQuantidade];

        arvoreBuscar(
            arvoreRaiz,
            codigoBusca,
            &buscaComparacoes);
    }

    clock_t tempoFim = clock();

    double tempoMs =
        ((double)(tempoFim - tempoInicio) * 1000.0) / CLOCKS_PER_SEC;

    printf("ABB\n");
    printf("Tempo: %.3f ms\n", tempoMs);
    printf("Comparacoes: %ld\n\n",
           buscaComparacoes);
}

static void experimentoBuscarHashExistentes(
    TabelaHash *hashTabela,
    int *produtoCodigos,
    int produtoQuantidade)
{
    long buscaComparacoes = 0;

    clock_t tempoInicio = clock();

    for (
        int buscaIndice = 0;
        buscaIndice < QUANTIDADE_BUSCAS;
        buscaIndice++)
    {
        int codigoBusca =
            produtoCodigos[rand() % produtoQuantidade];

        hashBuscar(
            hashTabela,
            codigoBusca,
            &buscaComparacoes);
    }

    clock_t tempoFim = clock();

    double tempoMs =
        ((double)(tempoFim - tempoInicio) * 1000.0) / CLOCKS_PER_SEC;

    printf("HASH\n");
    printf("Tempo: %.3f ms\n", tempoMs);
    printf("Comparacoes: %ld\n\n",
           buscaComparacoes);
}

static void experimentoBuscarABBInexistentes(
    NoArvore *arvoreRaiz)
{
    long buscaComparacoes = 0;

    clock_t tempoInicio = clock();

    for (
        int buscaIndice = 0;
        buscaIndice < QUANTIDADE_BUSCAS;
        buscaIndice++)
    {
        int codigoBusca =
            1000000 + buscaIndice;

        arvoreBuscar(
            arvoreRaiz,
            codigoBusca,
            &buscaComparacoes);
    }

    clock_t tempoFim = clock();

    double tempoMs =
        ((double)(tempoFim - tempoInicio) * 1000.0) / CLOCKS_PER_SEC;

    printf("ABB\n");
    printf("Tempo: %.3f ms\n", tempoMs);
    printf("Comparacoes: %ld\n\n",
           buscaComparacoes);
}

static void experimentoBuscarHashInexistentes(
    TabelaHash *hashTabela)
{
    long buscaComparacoes = 0;

    clock_t tempoInicio = clock();

    for (
        int buscaIndice = 0;
        buscaIndice < QUANTIDADE_BUSCAS;
        buscaIndice++)
    {
        int codigoBusca =
            1000000 + buscaIndice;

        hashBuscar(
            hashTabela,
            codigoBusca,
            &buscaComparacoes);
    }

    clock_t tempoFim = clock();

    double tempoMs =
        ((double)(tempoFim - tempoInicio) * 1000.0) / CLOCKS_PER_SEC;

    printf("HASH\n");
    printf("Tempo: %.3f ms\n", tempoMs);
    printf("Comparacoes: %ld\n\n",
           buscaComparacoes);
}