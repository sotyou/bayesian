'use strict'

const kmeans = require('node-kmeans')
const { norm, similarity, regularize } = require('../utils/calculate')
const { runBatchWithCount } = require('../utils/batch_work_wapper')

/**
 * generate a 2D matrix of time series
 * @param {Number} array 
 * @param {Number} len length of time series
 * @param {Number} interval slice interval
 */
function generateTimeSeries({len, interval = 1}, ...array) {
    const matrix = []
    const length = (array.length - len)%interval == 0 ? parseInt((array.length - len)/interval) : parseInt((array.length - len)/interval) + 1
    for (let i = 0; i < length; i ++) {
        const start = i * interval, end = start + len
        matrix.push([...array.slice(start, end), array[end] - array[end - 1]])
    }
    return matrix
}

/**
 * do kmeans
 * @param {Array[Array]} timeseries 
 * @param {Number} groups 
 */
function kmeansClusters(timeseries, groups) {
    return new Promise((resolve, reject) => {
        kmeans.clusterize(timeseries, {k: groups}, (err, res) => {
            if (err) {
                reject(err)
            }
            resolve(res.map(data => data.centroid))
        })
    })
}

function regularizeMatrix(matrix, len) {
    const result = []
    matrix.forEach(array => result.push(regularize(array, len)))
    return result
}

/**
 * Predict the average price change by poission distribution
 * @param {Array} x price Array 
 * @param {Array[Array]} 2D array generated by kmeans
 */
function predictDpiByPoission(x, s) {
    let num = 0, den = 0
    const len = x.length
    const x_norm = regularize(x)
    for (let i = 0; i < s.length; i ++) {
        const exp = Math.exp(-0.25 * norm(x_norm, s[i]))
        num += s[i][len] * exp
        den += exp
    }
    return num/den
}
/**
 *  这种慢多了
function predictDpiByPoission(x, s) {
    const start = process.hrtime.bigint()
    let num = 0, den = 0
    const len = x.length
    for (let i = 0; i < s.length; i ++) {
        const y_i = math.subset(s, math.index(i, x.length))
        const x_i = math.subset(s, math.index(i, [...Array(len).keys()]))[0]
        const exp = Math.exp(-0.25 * norm(x, x_i))
        num += y_i * exp
        den += exp
    }
    console.log(process.hrtime.bigint() - start);
    return num/den
}
 */

 /**
  * Predict the average price change by similarity
  * @param {Array} x 
  * @param {Array[Array]} s 
  * @param {Number} c 
  */
function predictDpiBySimilarity(x, s, c = -1) {
    let num = 0, den = 0
    const len = x.length
    for (let i = 0; i < s.length; i ++) {
        const si = similarity(x, s[i])
        console.log(si, s[i]);
        const exp = Math.exp(c * similarity(x, s[i]))
        num += s[i][len] * exp
        den += exp
    }
    return num/den
}

/**
 * Use the second time period to generate the independent and dependent variables 
    in the linear regression model Δp = w0 + w1 * Δp1 + w2 * Δp2 + w3 * Δp3 + w4 * r.
 * @param {Array} prices 
 * @param {Array} v_bid 
 * @param {Array} v_ask 
 * @param {Array[Array]} s1 
 * @param {Array[Array]} s2 
 * @param {Array[Array]} s3 
 */
function linearRegressionVars(prices, v_bid, v_ask, s1, s2, s3) {
    return new Promise((resolve, reject) => {
        const path = `${__dirname}/work/linear_regression_work.js`
        const X = new Array(prices.length - 721),
              Y = new Array(prices.length - 721)
        runBatchWithCount(path, {prices: prices, v_bid: v_bid, v_ask: v_ask, s1: s1, s2: s2, s3: s3}, prices.length - 721).then(map => {
            for (let [key, value] of map) {
                X[key] = value.x_i
                Y[key] = value.y_i
            }
            resolve([X, Y])
        })
    })
}

/**
 * Find the parameter values w for the model which best fits X and Y.
 * @param {Array} prices 
 * @param {Array} v_bid 
 * @param {Array} v_ask 
 * @param {Array[Array]} s1 
 * @param {Array[Array]} s2 
 * @param {Array[Array]} s3  
 * @param  {...Number} w 
 */
function predictDpi(prices, v_bid, v_ask, s1, s2, s3, ...w) {
    return new Promise((resolve, reject) => {
        const path = `${__dirname}/work/predict_dpi_work.js`
        const dpi = []
        runBatchWithCount(path, {prices: prices, v_bid: v_bid, v_ask: v_ask, s1: s1, s2: s2, s3: s3, w: w}, prices.length - 721).then(map => {
            for (let [key, value] of map) {
                dpi[key] = value
            }
            resolve(dpi)
        })
    })
}

module.exports = { generateTimeSeries, kmeansClusters, predictDpiByPoission, predictDpiBySimilarity, linearRegressionVars, predictDpi, regularizeMatrix }