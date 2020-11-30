'use strict'

/**
 * Examples
 */

// require('./src/utils/readCsv')
//     .readbyline({interval: 10, filePath: "data/bf_short_1s.csv"}, "price","bid_price","ask_price","v_bid","v_ask")
//     .then(data => console.log(data))

// require('./example/work/index')
//     .work("hello world", "javascrpt", "quant")
//     .then(data => console.log(data))

// const { regularize } = require('./src/utils/calculate')
// const target = [2,3,4,7,4,1,3,2,3,5,6,7,8,9,1,23]
// const matrix = require('./src/core/bayesian_calculate').generateTimeSeries({len: 3}, ...target)
// console.log(regularize(matrix[0], 3))

// const { generateTimeSeries, kmeansClusters } = require('./src/core/bayesian_calculate')
// const ts = generateTimeSeries({len: 3, interval: 1}, 1,3,4,12,45,6,3,23,62,8,5,8,2,21,3,454,5,45,345,435,44,324,34,6,6,6,54,65,64,54,453,54,53,5,55,65,76,687,5,32,43,4,64,564,53,42,42,43,44,65,33,67,85,65,54,453,3,1)
// kmeansClusters(ts, 4).then(data => data.map(cluster => console.log(cluster.centroid)))

// const s = [[21,3,44,10], [3,42,9,20]]
// console.log(require('./src/core/bayesian_calculate').predictDpiBySimilarity([1,2,3], s, 1))
// console.log(require('./src/core/bayesian_calculate').predictDpiByPoission([1,2,3], s))
