'use strict'
const { parentPort } = require('worker_threads')
const { kmeansClusters } = require('../bayesian_calculate')

parentPort.on("message", msg => {
    kmeansClusters(msg.timeseries, msg.group).then(data => parentPort.postMessage({tag: msg.tag, data: data}))
})