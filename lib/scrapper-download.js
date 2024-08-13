const os = require("os") 
const fs = require("fs") 
const got = require("got")
const path = require("path")
const fetch = require("node-fetch") 
const crypto = require("crypto") 
const cheerio = require("cheerio")
const Spotify = require("spotifydl-core").default
const Tiktok = require("@tobyg74/tiktok-api-dl")
const { default: axios } = require("axios") 
const { decryptSnapSaveInstagram, getRequestTiktok, getMusicTiktok, withParamsTiktok, fetchBuffer, getKeyTiktok } = require("./function.js") 
const spotify = new Spotify({ "clientId": "da607d68b3b04b84b38ab1ba0916857a", "clientSecret": "428c392bd6e14a1d82b26b79f67b9756" })



const youtubeDLV1 = async (url = "") => {
    const results = { status: false, data: {}, message: "" }
    const Downlib = (await import("downlib")).default
    const downlib = new Downlib({ deleteAfterDownload: true })
    await new Promise((resolve, reject) => {
        downlib.downloadFromYouTube(url, "./temp", { audioOnly: true }).then(({ success: status, buffer, json }) => {
            if (!status) {
                results.message = "Featured error."
                return results
            }
            const { title, thumbnail, description, channel_url, duration, view_count } = json
            results.data["details"] = {
                "title": title, 
                "thumbnail": thumbnail, 
                "duration": duration, 
                "views": view_count, 
                "channel": channel_url, 
                "description": description
            }
            results.data["audio"] = {
                buffer, 
                base64: buffer.toString("base64")
            }
            resolve(true) 
        }) 
    })
    await new Promise((resolve, reject) => {
        downlib.downloadFromYouTube(url, "./temp", { audioOnly: false }).then(({ success: status, buffer }) => {
            if (!status) {
                results.message = "Featured error."
                return results
            }
            results.data["video"] = {
                buffer, 
                base64: buffer.toString("base64")
            }
            resolve(true) 
        }) 
    })
    results.status = true
    return results
}

const instagramDLV1 = async (url = "") => {
    const results = { status: false, data: [], message: "" }
    try{
        const html = await got.post("https://snapsave.app/action.php?lang=id", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "origin": "https://snapsave.app",
                "referer": "https://snapsave.app/id",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
            },
            "form": { 
                "url": url.trim()
            }
        }).text() 
        const decode = decryptSnapSaveInstagram(html)
        const $ = cheerio.load(decode)
        if ($("table.table").length || $("article.media > figure").length) {
            const thumbnail = $("article.media > figure").find("img").attr("src")
            $("tbody > tr").each((_, el) => {
                let $el = $(el)
                let $td = $el.find("td")
                let _url = $td.eq(2).find("a").attr("href") || $td.eq(2).find("button").attr("onclick")
                let shouldRender = /get_progressApi/ig.test(_url || "")
                if (shouldRender) {
                    _url = /get_progressApi\("(.*?)"\)/.exec(_url || "")?.[1] || _url
                }
                results.data.push({ url: _url, thumbnail })
            })
        } else {
            $("div.download-items__thumb").each((_, tod) => {
                const thumbnail = $(tod).find("img").attr("src")
                $("div.download-items__btn").each((_, ol) => {
                    let _url = $(ol).find("a").attr("href")
                    if (!/https?:\/\//.test(_url || "")) _url = `https://snapsave.app${_url}`
                    results.data.push({ url: _url, thumbnail }) 
                })
            })
        }
        if (results.data.length > 0) { 
            results.status = true
        } else if (results.message == "") {
            results.message = "Failed request"
        }
        return results
    } catch {
        results.message = "Server sedang maitance..."
        return results
    }
}

const tiktokDLV1 = async (url = "") => {
    const results = { status: false, data: {}, message: "" }
    return await Tiktok.Downloader(url, { version: "v1" }).then(async (response1) => {
        if (response1.status == "success") {
            const { type, video, images, music } = response1.result
            if (type == "video") {
                results.data = {
                    "type": "video",
                    "video": video?.playAddr[0], 
                    "audio": music?.playUrl[0]
                }
            } else {
                results.data = {
                    "type": "image",
                    "image": images, 
                    "audio": music?.playUrl[0]
                }
            }
            results.status = true
            return results
        } else {
            return await Tiktok.Downloader(url, { version: "v2" }).then(async (response2) => {
                if (response2.status == "success") {
                    const { type, video, images, music } = response2.result
                    if (type == "video") {
                        results.data = {
                            "type": "video",
                            "video": video, 
                            "audio": music
                        }
                    } else {
                        results.data = {
                            "type": "image",
                            "image": images, 
                            "audio": music
                        }
                    }
                    results.status = true
                    return results
                } else {
                    return await Tiktok.Downloader(url, { version: "v3" }).then((response3) => {
                        if (response3.status == "success") {
                            const { type, video1, images, music } = response3.result
                            if (type == "video") {
                                results.data = {
                                    "type": "video",
                                    "video": video1, 
                                    "audio": music
                                }
                            } else {
                                results.data = {
                                    "type": "image",
                                    "image": images, 
                                    "audio": music
                                }
                            }
                            results.status = true
                        } else {
                            results.message = response3.message
                        }
                        return results
                    }) 
                }
            }) 
        }
    })
}


const githubDLV1 = async (url = "") => {
    const results = { status: false, data: {}, message: "" }
    if (url.startsWith("https://raw.githubusercontent.com/")) {
        return await axios({
            "method": "GET", 
            "url": url, 
            "headers": { 
                "DNT": 1,
                "Upgrade-Insecure-Request": 1
            },
            "responseType": "arraybuffer"
        }).then(({ status, data, headers }) => {
            if (status == 200) {
                results.data["mimetype"] = headers["content-type"]
                results.data["buffer"] = data
                results.data["base64"] = data.toString("base64")
                results.status = true
            } else {
                results.message = "Failed request"
            }
            return results
        }).catch(() => {
            results.message = "Buffer not found"
            return results
        })
    } else if (url.startsWith("https://github.com/") && url.replace("https://github.com", "").split("/").filter((x) => x !== "").length == 2) {
        const [accountName, repositoryName] = url.replace("https://github.com", "").split("/").filter((x) => x !== "") 
        return await axios.get("https://api.github.com").then(async (response1) => {
            if (response1?.status == 200) {
                return await axios.get("https://api.github.com/users/"+ accountName).then(async (response2) => {
                    if (response2?.status == 200) {
                        return await axios.get("https://api.github.com/repos/"+ accountName + "/"  + repositoryName).then(async (response3) => {
                            if (response3?.status == 200) {
                                return await axios({
                                    "method": "GET", 
                                    "url": "https://api.github.com/repos/" + response3?.data?.full_name + "/zipball", 
                                    "headers": { 
                                        "DNT": 1,
                                        "Upgrade-Insecure-Request": 1
                                    },
                                    "responseType": "arraybuffer"
                                }).then(({ status, data, headers }) => {
                                    if (status == 200) {
                                        results.data["mimetype"] = headers["content-type"]
                                        results.data["buffer"] = data
                                        results.data["base64"] = data.toString("base64")
                                        results.status = true
                                    } else {
                                        results.message = "Failed request"
                                    }
                                    return results
                                }).catch(() => {
                                    results.message = "Buffer not found"
                                    return results
                                })
                            } else {
                                results.message = "Failed request"
                            }
                            return results
                        }).catch(() => {
                            results.message = "Repository not found"
                            return results
                        })
                    } else {
                        results.message = "Failed request"
                    }
                    return results
                }).catch(() => {
                    results.message = "Account not found"
                    return results
                })
            } else {
                results.message = "Failed request"
                return results
            }
        }).catch(() => {
            results.message = "Server sedang maitance..."
            return results
        })
    } else if (url.startsWith("https://github.com/") && url.replace("https://github.com", "").split("/").filter((x) => x !== "").length > 2) {
        const [accountName, repositoryName, index2, branch] = url.replace("https://github.com", "").split("/").filter((x) => x !== "") 
        const paths = url.replace("https://github.com/" + accountName + "/" + repositoryName + "/" + index2 + "/" + branch + "/", "")
        return await axios.get("https://api.github.com").then(async (response1) => {
            if (response1?.status == 200) {
                return await axios.get("https://api.github.com/users/"+ accountName).then(async (response2) => {
                    if (response2?.status == 200) {
                        return await axios.get("https://api.github.com/repos/"+ accountName + "/"  + repositoryName).then(async (response3) => {
                            if (response3?.status == 200) {
                                return await axios.get("https://api.github.com/repos/"+ accountName + "/"  + repositoryName + "/contents/" + paths).then(({ status, data }) => {
                                    if (status == 200 && Array.isArray(data)) {
                                        results.data = data
                                        results.status = true
                                    } else if (status == 200 && !(Array.isArray(data))) {
                                        results.data["name"] = data?.name
                                        results.data["size"] = data?.size
                                        results.data["download_url"] = data?.download_url
                                        results.data["buffer"] = Buffer.from(data?.content, "base64")
                                        results.data["base64"] = data?.content
                                        results.status = true
                                    } else {
                                        results.message = "Failed request"
                                    }
                                    return results
                                }).catch(() => {
                                    results.message = "Paths not found"
                                    return results
                                })
                            } else {
                                results.message = "Failed request"
                            }
                            return results
                        }).catch(() => {
                            results.message = "Repository not found"
                            return results
                        })
                    } else {
                        results.message = "Failed request"
                    }
                    return results
                }).catch(() => {
                    results.message = "Account not found"
                    return results
                })
            } else {
                results.message = "Failed request"
                return results
            }
        }).catch(() => {
            results.message = "Server sedang maitance..."
            return results
        })
    }
}

const spotifyDLV1 = async (link) => {
    const results = { status: false, buffer: null, base64: null, message: "" }
    return await spotify.downloadTrack(link).then((buffer) => {
        results.buffer = buffer
        results.base64 = buffer.toString("base64")
        results.status = true
        return results
    }).catch(() => {
        results.message = "Server sedang error"
        return results
    })
}

module.exports = {
    youtubeDLV1, 
    instagramDLV1, 
    tiktokDLV1, 
    githubDLV1, 
    spotifyDLV1, 
}