'use strict'

const { readbyline } = require('./src/utils/readCsv')
const { split } = require('./src/utils/calculate')
const { generateTimeSeries, regularizeMatrix, linearRegressionVars, predictDpi } = require('./src/core/bayesian_calculate')
const { MultivariateLinearRegression } = require('ml-regression')
const { runBatch } = require('./src/utils/batch_work_wapper')

const runApp = async () => {
    const   map = await readbyline({interval: 10, filePath: "data/bf_all_1s.csv"}, "price","bid_price","ask_price","v_bid","v_ask"),

            prices = map.get("price"), 
            p_bid = map.get("bid_price"),   
            p_ask = map.get("ask_price"), 
            v_bid = map.get("v_bid"), 
            v_ask = map.get("v_ask"),

            [price1, price2, price3] = split(prices, 3),
            [v_bid1, v_bid2, v_bid3] = split(v_bid, 3),
            [v_ask1, v_ask2, v_ask3] = split(v_ask, 3),
            [p_bid1, p_bid2, p_bid3] = split(p_bid, 3),
            [p_ask1, p_ask2, p_ask3] = split(p_ask, 3),

            timeseries180 = generateTimeSeries({len: 180, interval: 180}, ...price1),
            timeseries360 = generateTimeSeries({len: 360, interval: 180}, ...price1),
            timeseries720 = generateTimeSeries({len: 720, interval: 180}, ...price1),

            mapClusters = await runBatch('./src/core/work/kmeans_work.js', {timeseries: timeseries180, group: 20, tag: 180}, {timeseries: timeseries360, group: 20, tag: 360}, {timeseries: timeseries720, group: 20, tag: 720}),

            s1 = regularizeMatrix(mapClusters.get(180), 180),
            s2 = regularizeMatrix(mapClusters.get(360), 360),
            s3 = regularizeMatrix(mapClusters.get(720), 720),

            [X, Y] = await linearRegressionVars(price2, v_bid2, v_ask2, s1, s2, s3),

            wMatrix = new MultivariateLinearRegression(X, Y).weights,
        
            dpi = await predictDpi(price3, v_bid3, v_ask3, s1, s2, s3, wMatrix[0][0], wMatrix[1][0], wMatrix[2][0], wMatrix[3][0], wMatrix[4][0])

}

runApp()