const csv = require('csvtojson')

function readbyLine(interval, filePath, delimiter=",") {
    let counter = -1
    const array = []
    return new Promise((resolve, reject) => {
        csv({ delimiter: delimiter }).fromFile(filePath)
            .on("data", (data) => {
                counter ++
                if (counter%interval == 0) {
                    array.push(JSON.parse(data))
                }
            })
            .on("done", () => {
                resolve(array)
            });
    })
}

module.exports = { readbyLine } 