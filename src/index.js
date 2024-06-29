const fs = require("fs")
const path = require("path")
const options = {}
fs.readdirSync(__dirname).filter((x) => x !== "index.js").map((a) => {
    if (!Object.keys(options).includes(a)) options[a] = {}
    for (const b of fs.readdirSync(path.join(__dirname, a)).filter((x) => x !== "index.js")) {
        if (!Object.keys(options[a]).includes(b)) options[a][b] = require("./" + path.join(a, b))
    }
    return options
}) 
module.exports = options