const { tiktokDLV1, tiktokDLV2 } = require("../../../lib/scrapper-download.js") 
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
    if (!Object.keys(options).includes("version") || options?.version !== "v1" && options?.version !== "v2") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await tiktokDLV1(url.trim()).then(async ({ status, data, message }) => {
                if (status) {
                    for (const x of data) {
                        if (x.isWatermark == false && x.type == "video" && !Object.keys(results.data).includes(x.type)) {
                            const { status, buffer } = await fetchBuffer(x.url)
                            results.data["type"] = x.type
                            if (status) {
                                results.data[x.type] = {
                                    "url": x.url, 
                                    "buffer": buffer, 
                                    "base64": buffer.toString("base64")
                                }
                            }
                        } else if (x.isWatermark == false && x.type == "image") {
                            const { status, buffer } = await fetchBuffer(x.url)
                            if (status) image.push({ url: x.url, buffer, base64: buffer.toString("base64") })
                        } else if (x.isWatermark == false && x.type == "audio" && !Object.keys(results.data).includes(x.type)) {
                            const { status, buffer } = await fetchBuffer(x.url)
                            if (status) {
                                results.data[x.type] = {
                                    "url": x.url, 
                                    "buffer": buffer, 
                                    "base64": buffer.toString("base64")
                                }
                            }
                        }
                    }
                    if (image.length > 0) {
                        results.data["type"] = "image"
                        results.data["image"] = image
                    }
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
                    for (const x of data) {
                        if (x.type == "video" && !Object.keys(results.data).includes(x.type)) {
                            const { status, buffer } = await fetchBuffer(x.url)
                            results.data["type"] = x.type
                            if (status) {
                                results.data[x.type] = {
                                    "url": x.url, 
                                    "buffer": buffer, 
                                    "base64": buffer.toString("base64")
                                }
                            }
                        } else if (x.type == "image") {
                            const { status, buffer } = await fetchBuffer(x.url)
                            if (status) image.push({ url: x.url, buffer, base64: buffer.toString("base64") })
                        } else if (x.type == "audio" && !Object.keys(results.data).includes(x.type)) {
                            const { status, buffer } = await fetchBuffer(x.url)
                            if (status) {
                                results.data[x.type] = {
                                    "url": x.url, 
                                    "buffer": buffer, 
                                    "base64": buffer.toString("base64")
                                }
                            }
                        }
                    }
                    if (image.length > 0) {
                        results.data["type"] = "image"
                        results.data["image"] = image
                    }
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