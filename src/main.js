(async(qsort) => {
  let module = {}
  let func = {}

  func.sortByJs = qsort

  const randomInt32Array = (size) => {
    let arr = new Int32Array(size)

    for (let i = 0; i < size; i++) {
      arr[i] = i
    }

    function shuffle (array) {
      let tmp
      let current
      let top = array.length

      if (top) {
        while (--top) {
          current = Math.floor(Math.random() * (top + 1))
          tmp = array[current]
          array[current] = array[top]
          array[top] = tmp
        }
      }
      return array
    }

    return shuffle(arr)
  }

  const sum = (arr) => {
    return arr.reduce((prev, curt) => {
      return prev + curt
    })
  }

  const mean = (array) => {
    return sum(array) / array.length
  }

  const benchmark = (size, count) => {
    let arr1 = randomInt32Array(size)
    let arr2 = new Int32Array(arr1)
    let time = {
      js: [],
      wasm: []
    }

    for (let i = 0; i < count; i++) {
      let t0 = window.performance.now()
      func.sortByJs(arr1)
      let t1 = window.performance.now()
      let diff = t1 - t0
      time.js.push(diff)

      t0 = window.performance.now()
      func.sortByWasm(arr2)
      t1 = window.performance.now()
      diff = t1 - t0
      time.wasm.push(diff)
    }

    return [mean(time.js), mean(time.wasm)]
  }

  const respose = await fetch('dist/quicksort_c.wasm')
  const buffer = await respose.arrayBuffer()
  const binary = await new Uint8Array(buffer)
  const modArgs = {
    wasmBinary: binary,
    onRuntimeInitialized: () => {
      const sort = module.cwrap('sort', null, [
        'number', 'number', 'number'
      ])

      func.sortByWasm = (arr) => {
        let pointer = module._malloc(arr.length * 4)
        let offset = pointer / 4
        module.HEAP32.set(arr, offset)
        sort(pointer, 0, arr.length)
        const result = module.HEAP32.subarray(offset, offset + arr.length)
        module._free(pointer)
        return result
      }

      let barChartData = {
        labels: [],
        datasets: [{
          label: 'js',
          data: [],
          borderColor: 'rgba(54,164,235,0.8)',
          backgroundColor: 'rgba(54,164,235,0.5)'
        }, {
          label: 'wasm',
          data: [],
          borderColor: 'rgba(254,97,132,0.8)',
          backgroundColor: 'rgba(254,97,132,0.5)'
        }]
      }

      for (let i = 10; i <= 100000; i *= 10) {
        const [timeJs, timeWasm] = benchmark(i, 10)
        barChartData.labels.push(i)
        barChartData.datasets[0].data.push(timeJs)
        barChartData.datasets[1].data.push(timeWasm)
      }

      let ctx = document.getElementById('canvas').getContext('2d')
      window.myBar = new Chart(ctx, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          scales: {
            xAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'sort item size',
                fontFamily: 'monospace',
                fontSize: 16
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: 'time (ms)',
                fontFamily: 'monospace',
                fontSize: 16
              }
            }]
          }
        }
      })
    }
  }
  module = Module(modArgs)
})(qsort)
