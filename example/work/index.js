
function work(...datas) {
    const path = `${__dirname}/worker.js`
    return new Promise((resolve, reject) => {
        require('../../src/utils/batch_work_wapper')
            .run(path, ...datas)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

module.exports = { work }