'use strict'
const { parentPort } = require('worker_threads')
const { predictDpiByPoission } = require('../bayesian_calculate')

parentPort.on("message", msg => {
    const {tag, data} = {...msg}
    const {prices, v_bid, v_ask, s1, s2, s3} = {...data}
    const i = tag + 720
    const   dp = prices[i + 1] - prices[i],
            dp1 = predictDpiByPoission(prices.slice(i - 180, i), s1),
            dp2 = predictDpiByPoission(prices.slice(i - 360, i), s2),
            dp3 = predictDpiByPoission(prices.slice(i - 720, i), s3),
            r = (v_bid[i] - v_ask[i])/(v_bid[i] + v_ask[i]),
    
            x_i = [dp1, dp2, dp3, r],
            y_i = [dp]

    parentPort.postMessage({
        tag: tag, 
        data: {
            x_i: x_i, 
            y_i: y_i
        }
    })
})