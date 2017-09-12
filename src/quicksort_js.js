/**
 * https://en.wikibooks.org/wiki/Algorithm_Implementation/Sorting/Quicksort#JavaScript
 */
function qsort(a) {
    if (a.length <= 1) return a;

    var left = [], right = [], pivot = a[0];

    for (var i = 1; i < a.length; i++) {
        a[i] < pivot ? left.push(a[i]) : right.push(a[i]);
    }

    return [...qsort(left), pivot, ...qsort(right)];
}
