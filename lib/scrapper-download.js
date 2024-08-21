const os = require("os") 
const fs = require("fs") 
const got = require("got")
const path = require("path")
const fetch = require("node-fetch") 
const crypto = require("crypto") 
const cheerio = require("cheerio")
const Tiktok = require("@tobyg74/tiktok-api-dl")
const { default: axios } = require("axios") 
const { decryptSnapSaveInstagram, fetchBuffer, getYoutubeID } = require("./function.js") 

const youtubeDLV1 = async (url = "") => {
    const results = { status: false, data: {}, message: "" }
    const videoID = getYoutubeID(url)
    const searchParams = new URLSearchParams()
    if (videoID == "VideoId tidak ditemukan") {
        results.message = videoID
        return results
    }
    searchParams.append("query", "https://youtu.be/" + videoID)
    searchParams.append("vt", "mp3")
    return await axios.post("https://tomp3.cc/api/ajax/search", searchParams.toString(), {
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Accept": "*/*",
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(async ({ status, data }) => {
        if (status == 200 && data.mess == "") {
            const mp4 = {}
            const mp3 = {}
            results.data["details"] = {
                "id": data?.vid, 
                "title": data?.title, 
                "duration": data?.t, 
                "channel": data?.a
            }
            for (const x of Object.keys(data.links.mp4)) {
                const convert = new URLSearchParams()
                convert.append("vid", data?.vid)
                convert.append("k", data.links.mp4[x].k)
                await axios.post("https://tomp3.cc/api/ajax/convert", convert.toString(), {
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "Accept": "*/*",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }).then((response) => {
                    if (response.status == 200 && response.data.c_status == "CONVERTED") {
                        mp4[x] = {
                            "type": response.data?.ftype, 
                            "size": data.links.mp4[x].size, 
                            "quality": response.data?.fquality, 
                            "url": response.data?.dlink
                        }
                    }
                }) 
            }
            for (const x of Object.keys(data.links.mp3)) {
                const convert = new URLSearchParams()
                convert.append("vid", data?.vid)
                convert.append("k", data.links.mp3[x].k)
                await axios.post("https://tomp3.cc/api/ajax/convert", convert.toString(), {
                    "headers": {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "Accept": "*/*",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                }).then((response) => {
                    if (response.status == 200 && response.data.c_status == "CONVERTED") {
                        mp3[x] = {
                            "type": response.data?.ftype, 
                            "size": data.links.mp3[x].size, 
                            "quality": response.data?.fquality, 
                            "url": response.data?.dlink
                        }
                    }
                }) 
            }
            results.data["mp4"] = mp4
            results.data["mp3"] = mp3
            results.status = true
        } else if (status == 200) {
            results.message = data.mess
        } else {
            results.message = "Failed request status " + status
        }
        return results
    }).catch(({ message }) => {
        results.message = message
        return results
    }) 
}

const youtubeDLV2 = async (url = "", format) => {
    const results = { status: false, data: {}, message: "" }
    const options = { status: true }
    const object = {
        "mp3": "MP3 Audio", 
        "360": "MP4 Video (360p)", 
        "480": "MP4 Video (480p)", 
        "720": "MP4 Video (720p)", 
        "1080": "MP4 Video (1080p)", 
        "1440": "MP4 Video (1440p)", 
    }
    if (!Object.keys(object).includes(format)) {
        results.message = "Format not found"
        return results
    }
    return await axios.get("https://loader.to/ajax/download.php?format=" + format + "&url=" + url + "&api=dfcb6d76f2f6a9894gjkege8a4ab232222").then(async (response) => {
        if (response.status == 200 && response.data.success) {
            for (let x = 0; options.status; x++) {
                await axios.get("https://p.oceansaver.in/ajax/progress.php?id=" + response.data.id).then(async ({ status, data }) => {
                    const text = data?.text || "";
                    if (status == 200 && text.toLowerCase() == "finished") {
                        results.data = {
                            title: response.data?.info?.title, 
                            thumbnail: response.data?.info?.image, 
                            url: data?.download_url
                        }
                        results.status = true
                        options.status = false
                    } else if (status == 200 && (text.toLowerCase() == "error" || data.success == 1)) {
                        results.message = "Video tidak di temukan"
                        options.status = false
                    } else if (options.status) {
                        results.message = "Scraper error."
                    }
                    return results
                }).catch(({ message }) => {
                    results.message = message
                    options.status = false
                    return results
                })
            }
        } else if (options.status) {
            results.message = "Scraper error."
        }
        return results
    }).catch(({ message }) => {
        results.message = message
        return results
    })
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
    results.message = "Scrapers sedang error."
    return results
}

module.exports = {
    youtubeDLV1, 
    youtubeDLV2, 
    instagramDLV1, 
    tiktokDLV1, 
    githubDLV1, 
    spotifyDLV1, 
}