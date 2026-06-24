#include <stdlib.h>
#include <time.h>

#include "gerador.h"

void produtoEmbaralhar(
    int *produtoCodigos,
    int produtoQuantidade)
{
    for (
        int indice = produtoQuantidade - 1;
        indice > 0;
        indice--)
    {
        int indiceAleatorio =
            rand() % (indice + 1);

        int valorTemporario =
            produtoCodigos[indice];

        produtoCodigos[indice] =
            produtoCodigos[indiceAleatorio];

        produtoCodigos[indiceAleatorio] =
            valorTemporario;
    }
}

int *produtoGerarCodigos(
    int produtoQuantidade)
{
    int *produtoCodigos =
        (int *)malloc(
            sizeof(int) * produtoQuantidade);

    for (
        int indice = 0;
        indice < produtoQuantidade;
        indice++)
    {
        produtoCodigos[indice] =
            indice + 1;
    }

    produtoEmbaralhar(
        produtoCodigos,
        produtoQuantidade);

    return produtoCodigos;
}