'use strict'
const math = require('mathjs');

/**
 * normalize
 * @param {Array} array 
 * @param {Number} len first * elements in the array which needs to be normalized
 */
function normalize(array, len = array.length) {
    if (len > array.length) len = array.length
    const sliced = len == array.len ? array : array.slice(0, len)
    const max = Math.max(...array)
    const min = Math.min(...array)
    return sliced.reduce((acc, val) => acc.concat((val - min)/(max - min)), []).concat(array.slice(len))
}

/**
 * regularize so the mean = 0 and std =1
 * @param {Array} array 
 * @param {Number} len first * elements in the array which needs to be normalized
 */
function regularize(array, len = array.length) {
    if (len > array.length) len = array.length
    const sliced = len == array.len ? array : array.slice(0, len)
    const mean = sliced.reduce((acc, val) => acc + val, 0)/len
    const std = stddev(sliced)
    return sliced.reduce((acc, val) => acc.concat((val - mean)/std), []).concat(array.slice(len))
}

/**
 * calculate 2D norm of diffs of a and b
 * @param {Array} a 
 * @param {Array} b 
 */
function norm(a, b) {
    const diff = a.reduce((acc, val, index) => acc.concat(val - b[index]), [])
    return math.norm(diff) ** 2
}

/**
 * calculate standard error of an array
 * @param {Array} array 
 */
function stddev(array) {
    const mean = array.reduce((acc, val) => acc + val, 0)/array.length
    return Math.sqrt(array.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0)/array.length)
};

/**
 * slice an array into equal-length arrays
 * @param {Array} array target
 * @param {Number} slice number of slices
 */
function split(array, slice) {
    const count = parseInt(array.length/slice)
    const length = array.length % slice == 0 ? count : count + 1
    const results = new Array()
    for (let i = 0; i < slice; i ++) {
        results.push(array.slice(i * length, (i + 1) * length))
    }

    return results
}

/**
 * Similarity of two arrays
 * @param {Array} x 
 * @param {Array} y 
 */
function similarity(x, y) {
    const y_x = y.slice(0, x.length)
    const len = x.length
    let num = 0
    const den = len * stddev(x) * stddev(y_x)
    const x_m = x.reduce((acc, val) => acc + val)/len
    const y_m = y_x.reduce((acc, val) => acc + val)/len
    for (let i = 0; i < len; i ++) {
        num += (x[i] - x_m) * (y_x[i] - y_m)
    }
    return num/den
}

/**
 * slice an array with fixed intervals and form the resulted arrays into a 2D matrix
 * @param {Array} array 
 * @param {Number} dataLength length of slices
 * @param {Number} interval slice interval
 */
function generateSeryMatrix(array, dataLength, interval = 1) {
    const matrix = []
    for (let i = 0; i < parseInt((array.length - dataLength)/interval + 1); i ++) {
        matrix.push(array.slice(i * interval, i * interval + dataLength))
    }
    return matrix
}

module.exports = { norm, normalize, regularize, similarity, stddev, split, generateSeryMatrix }