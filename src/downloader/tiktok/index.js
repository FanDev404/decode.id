const { tiktokDLV1, tiktokDLV2, tiktokDLV3, tiktokDLV4 } = require("../../../lib/scrapper-download.js") 
const { fetchBuffer } = require("../../../lib/function.js") 
module.exports = async (url = "", options = { version: "v1" }) => {
    const image = []
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": {}, 
        "message": ""
    }
    if (!url.trim().startsWith("https://vt.tiktok.com/") && !url.trim().startsWith("https://vm.tiktok.com/") && !url.trim().startsWith("https://www.tiktok.com/") || url.trim().startsWith("https://vt.tiktok.com/") && url.trim().split(".com/")[1] == "" || url.trim().startsWith("https://vm.tiktok.com/") && url.trim().split(".com/")[1] == "" || url.trim().startsWith("https://www.tiktok.com/") && url.trim().split(".com/")[1] == "") {
        results.message = "Link Url not valid"
        return results
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1" && options?.version !== "v2" && options?.version !== "v3" && options?.version !== "v4") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await tiktokDLV1(url.trim()).then(async ({ status, data, message }) => {
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
            return await tiktokDLV2(url.trim()).then(async ({ status, data, message }) => {
                if (status) {
                    results.data = data
                    results.status = true
                } else {
                    results.message = message
                }
                return results
            }) 
        break
        case "v3":
            results.message = "Maitance....."
            return results
        break
        case "v4":
            return await tiktokDLV4(url.trim()).then(async ({ status, data, message }) => {
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