const fs = require("fs")
const options = {}

for (const x of fs.readdirSync(__dirname).filter((x) => x !== "index.js")) {
    if (!Object.keys(options).includes(x)) options[x] = require("./" + x)
}

module.exports = options