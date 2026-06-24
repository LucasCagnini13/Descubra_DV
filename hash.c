#include <stdlib.h>
#include "hash.h"

static NoHash *hashCriarNo(
    int produtoCodigo)
{
    NoHash *novoNo = (NoHash *)malloc(sizeof(NoHash));

    novoNo->produtoCodigo = produtoCodigo;
    novoNo->proximo = NULL;

    return novoNo;
}

TabelaHash *hashCriar(
    int tabelaTamanho)
{
    TabelaHash *hashTabela =
        (TabelaHash *)malloc(sizeof(TabelaHash));

    hashTabela->tabelaTamanho = tabelaTamanho;

    hashTabela->listaBuckets =
        (NoHash **)malloc(
            sizeof(NoHash *) * tabelaTamanho);

    for (int indice = 0; indice < tabelaTamanho; indice++)
    {
        hashTabela->listaBuckets[indice] = NULL;
    }

    return hashTabela;
}

int hashCalcularIndice(
    int produtoCodigo,
    int tabelaTamanho)
{
    return produtoCodigo % tabelaTamanho;
}

void hashInserir(
    TabelaHash *hashTabela,
    int produtoCodigo)
{
    int bucketIndice =
        hashCalcularIndice(
            produtoCodigo,
            hashTabela->tabelaTamanho);

    NoHash *novoNo =
        hashCriarNo(produtoCodigo);

    novoNo->proximo =
        hashTabela->listaBuckets[bucketIndice];

    hashTabela->listaBuckets[bucketIndice] =
        novoNo;
}

int hashBuscar(
    TabelaHash *hashTabela,
    int produtoCodigo,
    long *buscaComparacoes)
{
    int bucketIndice =
        hashCalcularIndice(
            produtoCodigo,
            hashTabela->tabelaTamanho);

    NoHash *noAtual =
        hashTabela->listaBuckets[bucketIndice];

    while (noAtual != NULL)
    {

        (*buscaComparacoes)++;

        if (noAtual->produtoCodigo == produtoCodigo)
        {
            return 1;
        }

        noAtual = noAtual->proximo;
    }

    return 0;
}

void hashLiberar(
    TabelaHash *hashTabela)
{
    if (hashTabela == NULL)
    {
        return;
    }

    for (
        int bucketIndice = 0;
        bucketIndice < hashTabela->tabelaTamanho;
        bucketIndice++)
    {
        NoHash *noAtual =
            hashTabela->listaBuckets[bucketIndice];

        while (noAtual != NULL)
        {

            NoHash *proximoNo =
                noAtual->proximo;

            free(noAtual);

            noAtual = proximoNo;
        }
    }

    free(hashTabela->listaBuckets);
    free(hashTabela);
}