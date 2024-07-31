const { chatGPTV1, chatGPTV2 } = require("../../../lib/scrapper-tools.js") 
module.exports = async (text = "", options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": "", 
        "message": ""
    }
    if (!text) {
        results.message = "Message not valid"
        return results
    } 
    if (!Object.keys(options).includes("version") || options?.version !== "v1" && options?.version !== "v2") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await chatGPTV1(text.trim()).then(({ status, data, message }) => {
                if (status) {
                    results.data = data
                    results.status = true
                } else {
                    results.message = message
                }
                return results
            }) 
        break
        case "v2":
            return await chatGPTV2(text.trim()).then(({ status, data, message }) => {
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