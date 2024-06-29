const { chatGPTV1 } = require("../../../lib/scrapper-tools.js") 
module.exports = async (text = "", apikey = "", options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": "", 
        "message": ""
    }
    if (!text) {
        results.message = "Message not valid"
        return results
    } else if (!apikey) {
        results.message = "Apikey not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await chatGPTV1(text.trim(), apikey).then(({ status, data, message }) => {
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