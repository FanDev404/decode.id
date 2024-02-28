const { fromBuffer } = require("file-type")    
const { fetchBuffer } = require("../../../lib/function.js") 
const { instagramDLV1 } = require("../../../lib/scrapper-download.js") 
module.exports = async (url = "", options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": [], 
        "message": ""
    }
    if (!url.trim().startsWith("https://www.instagram.com/reel/") && !url.trim().startsWith("https://www.instagram.com/p/") && !url.trim().startsWith("https://www.instagram.com/tv/") || url.trim().startsWith("https://www.instagram.com/reel/") && url.trim().split("/reel/")[1] == "" || url.trim().startsWith("https://www.instagram.com/p/") && url.trim().split("/p/")[1] == "" || url.trim().startsWith("https://www.instagram.com/tv/") && url.trim().split("/tv/")[1] == "") {
        results.message = "Link Url not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await instagramDLV1(url.trim()).then(async (response) => {
                if (response.status) {
                    for (const x of response.data) {
                        const { status, buffer } = await fetchBuffer(x.url)
                        if (status) {
                            const { ext } = await fromBuffer(buffer)
                            results.data.push({ type: (ext == "jpg" || ext == "jpeg" || ext == "png")? "image" : "video", url: x.url, thumbnail: x.thumbnail, buffer, base64: buffer.toString("base64") })
                        }
                    }
                    results.status = true
                } else {
                    results.message = response.message
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