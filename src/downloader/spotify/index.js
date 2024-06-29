const { spotifyDLV1 } = require("../../../lib/scrapper-download.js") 
module.exports = async (url = "", options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": {}, 
        "message": ""
    }
    if (!url.trim().startsWith("https://open.spotify.com/track/") || url.trim().startsWith("https://open.spotify.com/track/") && url.trim().split("/track/")[1] == "") {
        results.message = "Link Url not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await spotifyDLV1(url.trim()).then(({ status, buffer, base64, message }) => {
                if (status) {
                    results.data["buffer"] = buffer
                    results.data["base64"] = base64
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