'use strict';
const { WorkerPool } = require('./worker_pool')
const cpus = require("os").cpus().length

function runBatch(workerPath, ...datas) {
    return new Promise((resolve, reject) => {
        const pool = new WorkerPool(workerPath, Math.min(datas.length, cpus))
        const results = new Map()
        Promise.all(datas.map(async data => {
            const msg = await pool.run(data)
            results.set(msg.tag, msg.data)
        })).then(() => {
            pool.destroy()
            resolve(results)
        }).catch(err => reject(err))
    })
}

function runBatchWithCount(workerPath, data, count) {
    return new Promise((resolve, reject) => {
        const pool = new WorkerPool(workerPath, Math.min(count, cpus))
        const results = new Map()
        const array = [...Array(count).keys()]
        Promise.all(array.map(async tag => {
            const msg = await pool.run({tag: tag, data: data})
            results.set(msg.tag, msg.data)
        })).then(() => {
            pool.destroy()
            resolve(results)
        }).catch(err => reject(err))
    })
}

module.exports = { runBatch, runBatchWithCount }