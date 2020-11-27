const { readbyLine } = require('./src/readCsv')

async function wait() {
    const r = await readbyLine(10, 'bf_short_1s.csv')
    console.log(r);
}

wait()