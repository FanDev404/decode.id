const { isUrl, isBase64, isFiles } = require("../../../lib/function.js")
const { uploadFileGithubV1 } = require("../../../lib/scrapper-converter.js") 
module.exports = async (content, metadata = { name: "", repository: "", token: "" }, options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": "", 
        "message": ""
    }
    if (!isUrl(content) && !Buffer.isBuffer(content) && !isBase64(content) && !(isFiles(content) == true)) {
        results.message = "content not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await uploadFileGithubV1(content, metadata).then(({ status, data, message }) => {
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