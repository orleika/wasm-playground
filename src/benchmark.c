#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include "quicksort.h"

void shuffle(int array[], size_t n)
{
    if (n > 1)
    {
        size_t i;
        for (i = 0; i < n - 1; i++)
        {
          size_t j = i + rand() / (RAND_MAX / (n - i) + 1);
          int t = array[j];
          array[j] = array[i];
          array[i] = t;
        }
    }
}

void benchmark(int size, size_t count)
{
    struct timespec tstart={0,0}, tend={0,0};
    int array[size];

    for (size_t i = 0; i < count; i++) {
        for (size_t j = 0; j < size; j++) {
            array[j] = j;
        }
        shuffle(array, size);
        clock_gettime(CLOCK_MONOTONIC, &tstart);
        sort(array, 0, size - 1);
        clock_gettime(CLOCK_MONOTONIC, &tend);
        printf("[%d] %.5f s\n",
               size,
               ((double)tend.tv_sec + 1.0e-9*tend.tv_nsec) -
               ((double)tstart.tv_sec + 1.0e-9*tstart.tv_nsec));
    }
}

int main()
{
    for (size_t i = 10; i <= 100000; i *= 10) {
      benchmark(i, 10);
    }

    return 0;
}
