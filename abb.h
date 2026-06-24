#ifndef ABB_H
#define ABB_H

typedef struct NoArvore
{
    int produtoCodigo;
    struct NoArvore *filhoEsquerda;
    struct NoArvore *filhoDireita;
} NoArvore;

/*
 * Insere um código na árvore.
 */
NoArvore *arvoreInserir(
    NoArvore *arvoreRaiz,
    int produtoCodigo);

/*
 * Busca um código na árvore.
 * Retorna:
 * 1 -> encontrado
 * 0 -> não encontrado
 */
int arvoreBuscar(
    NoArvore *arvoreRaiz,
    int produtoCodigo,
    long *buscaComparacoes);

/*
 * Libera toda a memória da árvore.
 */
void arvoreLiberar(
    NoArvore *arvoreRaiz);

#endif