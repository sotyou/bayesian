const csv = require('csvtojson')

function readbyline({interval, filePath, delimiter=","}, ...titles) {
    let counter = -1
    const map = new Map()
    titles.forEach(title => {
        map.set(title, new Array())
    })
    return new Promise((resolve, reject) => {
        csv({ delimiter: delimiter }).fromFile(filePath)
            .on("data", (data) => {
                counter ++
                if (counter%interval == 0) {
                    const json = JSON.parse(data)
                    for (let key in json) {
                        if (json[key] == 0) {
                            return
                        }
                    }
                    for (let key in json) {
                        if (map.has(key)) {
                            map.get(key).push(parseFloat(json[key]))
                        }
                    }
                }
            })
            .on("done", () => {
                resolve(map)
            });
    })
}

module.exports = { readbyline } 