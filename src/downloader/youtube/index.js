const { youtubeDLV1, youtubeDLV2 } = require("../../../lib/scrapper-download.js") 
module.exports = async (url = "", options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": {}, 
        "message": ""
    }
    if (!url.trim().startsWith("https://www.youtube.com/watch?v=") && !url.trim().startsWith("https://youtube.com/watch?v=") && !url.trim().startsWith("https://youtube.com/shorts/") && !url.trim().startsWith("https://youtu.be/") || url.trim().startsWith("https://www.youtube.com/watch?v=") && url.trim().split("/watch?v=")[1] == "" || url.trim().startsWith("https://youtube.com/watch?v=") && url.trim().split("/watch?v=")[1] == "" || url.trim().startsWith("https://youtube.com/shorts/") && url.trim().split("/shorts/")[1] == "" || url.trim().startsWith("https://youtu.be/") && url.trim().split("https://youtu.be/")[1] == "") {
        results.message = "Link Url not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1" && options?.version !== "v2") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await youtubeDLV1(url.trim()).then(({ status, data, message }) => {
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
            return await youtubeDLV2(url.trim()).then(({ status, data, message }) => {
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