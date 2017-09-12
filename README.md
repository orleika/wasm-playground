# WebAssembly Playground _(wasm-playground)_

[![emscripten](http://img.shields.io/badge/Emscripten-1.37.21-blue.svg?style=flat-square)](https://github.com/kripken/emscripten)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)

> WebAssembly playground

Try below page.  
https://orleika.github.io/wasm-playground/index.html

## Compile

```
emcc src/quicksort.c -O3 -s WASM=1 -s "MODULARIZE=1" -s "EXPORTED_FUNCTIONS=['_sort']" -o dist/quicksort.js
```

## Maintainers

[orleika](mailto:admin@orleika.io)

## License

[MIT © orleika](LICENSE)
