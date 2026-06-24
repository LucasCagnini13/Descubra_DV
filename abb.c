#include <stdlib.h>
#include "abb.h"

static NoArvore *arvoreCriarNo(int produtoCodigo)
{
    NoArvore *novoNo = (NoArvore *)malloc(sizeof(NoArvore));

    novoNo->produtoCodigo = produtoCodigo;
    novoNo->filhoEsquerda = NULL;
    novoNo->filhoDireita = NULL;

    return novoNo;
}

NoArvore *arvoreInserir(
    NoArvore *arvoreRaiz,
    int produtoCodigo)
{
    if (arvoreRaiz == NULL)
    {
        return arvoreCriarNo(produtoCodigo);
    }

    if (produtoCodigo < arvoreRaiz->produtoCodigo)
    {
        arvoreRaiz->filhoEsquerda =
            arvoreInserir(
                arvoreRaiz->filhoEsquerda,
                produtoCodigo);
    }
    else if (produtoCodigo > arvoreRaiz->produtoCodigo)
    {
        arvoreRaiz->filhoDireita =
            arvoreInserir(
                arvoreRaiz->filhoDireita,
                produtoCodigo);
    }

    return arvoreRaiz;
}

int arvoreBuscar(
    NoArvore *arvoreRaiz,
    int produtoCodigo,
    long *buscaComparacoes)
{
    if (arvoreRaiz == NULL)
    {
        return 0;
    }

    (*buscaComparacoes)++;

    if (produtoCodigo == arvoreRaiz->produtoCodigo)
    {
        return 1;
    }

    if (produtoCodigo < arvoreRaiz->produtoCodigo)
    {
        return arvoreBuscar(
            arvoreRaiz->filhoEsquerda,
            produtoCodigo,
            buscaComparacoes);
    }

    return arvoreBuscar(
        arvoreRaiz->filhoDireita,
        produtoCodigo,
        buscaComparacoes);
}

void arvoreLiberar(
    NoArvore *arvoreRaiz)
{
    if (arvoreRaiz == NULL)
    {
        return;
    }

    arvoreLiberar(arvoreRaiz->filhoEsquerda);
    arvoreLiberar(arvoreRaiz->filhoDireita);

    free(arvoreRaiz);
}