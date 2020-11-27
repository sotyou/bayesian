'use strict'

/**
 * Examples
 */
require('./src/utils/readCsv')
    .readbyline({interval: 10, filePath: "data/bf_short_1s.csv"}, "price","bid_price","ask_price","v_bid","v_ask")
    .then(data => console.log(data))
require('./example/work/index')
    .work("hello world", "javascrpt", "quant")
    .then(data => console.log(data))
