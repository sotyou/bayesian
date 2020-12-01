'use strict'
const { parentPort } = require('worker_threads')
const { predictDpiByPoission } = require('../bayesian_calculate')

parentPort.on("message", msg => {
    const {tag, data} = {...msg}
    const {prices, v_bid, v_ask, s1, s2, s3, w} = {...data}
    const [w1, w2, w3, w4, w0] = [...w]
    const i = tag + 720
    const   dp1 = predictDpiByPoission(prices.slice(i - 180, i), s1),
            dp2 = predictDpiByPoission(prices.slice(i - 360, i), s2),
            dp3 = predictDpiByPoission(prices.slice(i - 720, i), s3),
            r = (v_bid[i] - v_ask[i])/(v_bid[i] + v_ask[i]),
    
            dp = w0 + w1 * dp1 + w2 * dp2 + w3 * dp3 + w4 * r

    parentPort.postMessage({
        tag: tag, 
        data: dp
    })
})