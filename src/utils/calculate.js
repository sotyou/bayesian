function norm(array, len = array.length) {
    if (len > array.length) len = array.length
    const sliced = len == array.len ? array : array.slice(0, len)
    const after = array.slice(len)
    const mean = sliced.reduce((acc, val) => acc + val, 0)/len
    const std = stddev(sliced)
    return sliced.reduce((acc, val) => acc.concat((val - mean)/std), []).concat(after)
}

function stddev(array) {
    const mean = array.reduce((acc, val) => acc + val, 0)/arr.length
    return Math.sqrt(array.reduce((acc, val) => acc.concat((val - mean) ** 2), []).reduce((acc, val) => acc + val, 0)/array.length)
};

function split(array, slice) {
    const count = parseInt(array.length/slice)
    const length = array.length % slice == 0 ? count : count + 1
    const results = new Array()
    for (let i = 0; i < slice; i ++) {
        results.push(array.slice(i * length, (i + 1) * length))
    }

    return results
}

function generateSeryMatrix(array, dataLength, interval = 1) {
    const matrix = []
    for (let i = 0; i < parseInt((array.length - dataLength)/interval + 1); i ++) {
        matrix.push(array.slice(i * interval, i * interval + dataLength))
    }
    return matrix
}

module.exports = { norm, stddev, split, generateSeryMatrix }