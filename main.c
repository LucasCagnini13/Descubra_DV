#include <stdio.h>
#include <stdlib.h>
#include <time.h>

#include "experimento.h"

int main()
{

    srand(time(NULL));

    experimentoExecutar(100);

    experimentoExecutar(10000);

    experimentoExecutar(50000);

    experimentoExecutar(100000);

    return 0;
}