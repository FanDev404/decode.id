const { isUrl } = require("../../../lib/function.js")
const { quickChatToWebpV1 } = require("../../../lib/scrapper-converter.js") 
module.exports = async (name, text, content, options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": "", 
        "message": ""
    }
    if (!name) {
        results.message = "username?"
        return results
    } else if (!text) {
        results.message = "text?"
        return results
    } else if (!isUrl(content)) {
        results.message = "content not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await quickChatToWebpV1(name, text, content).then(({ status, data, message }) => {
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
