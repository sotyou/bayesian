'use strict';
const { WorkerPool } = require('./worker_pool')
const cpus = require("os").cpus().length

function run(workerPath, ...datas) {
    const pool = new WorkerPool(workerPath, Math.min(datas.length, cpus))
    const results = new Array()
    return new Promise((resolve, reject) => {
        Promise.all(datas.map(async data => {
            results.push(await pool.run(data));
        })).then(() => {
            pool.destroy()
            resolve(results)
        }).catch(err => reject(err));
    })
}

module.exports = { run }