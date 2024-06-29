const { randomNsfwNekoV1 } = require("../../../lib/scrapper-random-nsfw.js")
module.exports = async (options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": {}, 
        "message": ""
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await randomNsfwNekoV1().then(({ status, data, message }) => {
                if (status) {
                    results.data = data
                    results.status = true
                } else {
                    results.message = message
                }
                return results
            }) 
        break
        default: 
        if (results.message == "") {
            results.message = "Failed request"
        }
        return results
    }
}