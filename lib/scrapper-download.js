const os = require("os") 
const fs = require("fs") 
const got = require("got")
const path = require("path")
const crypto = require("crypto") 
const cheerio = require("cheerio")
const Spotify = require("spotifydl-core") 
const youtubeDownlad = require("ytdl-core")
const { default: axios } = require("axios") 
const { decryptSnapSaveInstagram, getRequestTiktok, getMusicTiktok, withParamsTiktok, fetchBuffer, getKeyTiktok } = require("./function.js") 

const youtubeDLV1 = async (url = "") => {
    const results = { status: false, data: {}, message: "" }
    const mp3File = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp3`)
    const mp4File = path.join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
    return await youtubeDownlad.getInfo(url.trim()).then(async ({ player_response }) => {
        results.data["details"] = {
            "id": player_response?.videoDetails?.videoId,
            "author": player_response?.videoDetails?.author,
            "title": player_response?.videoDetails?.title, 
            "thumbnail": player_response?.videoDetails?.thumbnail?.thumbnails.filter((x) => (x.width > 1000 && x.height > 1000)).length > 0? player_response?.videoDetails?.thumbnail?.thumbnails.find((x) => (x.width > 1000 && x.height > 1000)).url : player_response?.videoDetails?.thumbnail?.thumbnails.find((x) => (x.width < 1000 && x.height < 1000)).url, 
            "second": player_response?.videoDetails?.lengthSeconds, 
            "views": player_response?.videoDetails?.viewCount, 
            "channel": "https://youtube.com/channel/" + player_response?.videoDetails?.channelId, 
            "description": player_response?.videoDetails?.shortDescription, 
        }
        await new Promise((resolve, reject) => {
            youtubeDownlad(url, { filter: "audioonly" }).pipe(fs.createWriteStream(mp3File)).on("finish", () => resolve(true))
        })
        await new Promise((resolve, reject) => {
            youtubeDownlad(url).pipe(fs.createWriteStream(mp4File)).on("finish", () => resolve(true))
        })
        results.data["download_mp3"] = {
            "buffer": fs.readFileSync(mp3File), 
            "base64": fs.readFileSync(mp3File).toString("base64")
        }
        results.data["download_mp4"] = {
            "buffer": fs.readFileSync(mp4File), 
            "base64": fs.readFileSync(mp4File).toString("base64")
        }
        fs.unlinkSync(mp3File)
        fs.unlinkSync(mp4File)
        results.status = true
        return results
    }).catch((err) => {
        results.message = String(err) 
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
    const results = { status: false, data: [], message: "" }
    const request = await getRequestTiktok(url.trim())
    if (!request.status) {
        results.message = request.message
        return results
    }
    return await axios({
        "url": "https://musicaldown.com/download", 
        "method": "POST",
        "headers": {
            "cookie": request.data.cookie,
            "Upgrade-Insecure-Requests": "1",
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0"
        },
        "data": new URLSearchParams(Object.entries(request.data.request))
    }).then(async (response) => {
        if (response.status == 200) {
            const $ = cheerio.load(response.data)
            $("div.row > div[class='col s12 m3']").get().map((x) => {
                results.data.push({
                    type: "image",
                    url: $(x).find("img").attr("src"), 
                    isWatermark: false
                })
            })
            $("div[class='col s12 l8'] > a").get().map((x) => {
                if ($(x).attr("href") !== "#modal2") {
                    const quality = $(x).text().trim().replace(/\s/, " ").replace("arrow_downward", "").toLowerCase()
                    results.data.push({
                        type: "video",
                        url: $(x).attr("href"), 
                        isWatermark: quality.includes("watermark")
                    })
                }
            })
            if (results.data.filter((x) => x.type == "image").length > 0) {
                results.data.push({
                    type: "audio",
                    url: $("a.download").attr("href"), 
                    isWatermark: false
                })
                results.status = true
            } else {
                const { status, data, message } = await getMusicTiktok(request.data.cookie)
                if (status) {
                    results.data.push({
                        type: "audio",
                        url: data, 
                        isWatermark: false
                    })
                    results.status = true
                } else {
                    results.message = "Failed request"
                }
            }
        } else {
            results.message = "Failed request"
        }
        return results
    }).catch(() => {
        results.message = "Server sedang maitance..."
        return results
    }) 
}

const tiktokDLV2 = async (url = "") => {
    const results = { status: false, data: [], message: "" }
    if (url.trim().startsWith("https://www.tiktok.com/")) {
        let optionUrl = new URLSearchParams(withParamsTiktok({ aweme_id: url })).toString()
        return axios.get("https://api.tiktokv.com/aweme/v1/feed/?" + optionUrl).then((response) => {
            if (response.status == 200) {
                const { image_post_info, music, video } = response.data.aweme_list.find((x) => x.aweme_id == url)
                if (!!image_post_info) {
                    for (const x of image_post_info.images.map((x) => x.display_image.url_list[0])) {
                        results.data.push({
                            type: "image",
                            name: "image" + (results.data.length + 1), 
                            url: x
                        })
                    }
                    for (const x of music.play_url.url_list) {
                        results.data.push({
                            type: "audio",
                            name: "audio" + (results.data.filter((x) => x.type == "audio").length + 1), 
                            url: x
                        })
                    }
                    results.status = true
                } else if (!image_post_info) {
                    for (const x of video.play_addr.url_list) {
                        results.data.push({
                            type: "video",
                            name: "video" + (results.data.length + 1), 
                            url: x
                        })
                    }
                    for (const x of music.play_url.url_list) {
                        results.data.push({
                            type: "audio",
                            name: "audio" + (results.data.filter((x) => x.type == "audio").length + 1), 
                            url: x
                        })
                    }
                    results.status = true
                } else {
                    results.message = "Failed to fetch tiktok url. Make sure your tiktok url is correct!"
                }
            } else {
                results.message = "Failed request"
            }
            return results
        }).catch(() => {
            results.message = "Server sedang maitance..."
            return results
        })
    } else return await axios.head(url.trim()).then(async ({ status, request }) => {
        if (status == 200) {
            let { responseUrl } = request.res
            let ID = responseUrl.match(/\d{17,21}/g)
            if (ID == null) {
                results.message = "Failed to fetch tiktok url. Make sure your tiktok url is correct!"
                return results
            }
            ID = ID[0]
            let optionUrl = new URLSearchParams(withParamsTiktok({ aweme_id: ID })).toString()
            return axios.get("https://api.tiktokv.com/aweme/v1/feed/?" + optionUrl).then((response) => {
                if (response.status == 200) {
                    const { image_post_info, music, video } = response.data.aweme_list.find((x) => x.aweme_id == ID)
                    if (!!image_post_info) {
                        for (const x of image_post_info.images.map((x) => x.display_image.url_list[0])) {
                            results.data.push({
                                type: "image",
                                name: "image" + (results.data.length + 1), 
                                url: x
                            })
                        }
                        for (const x of music.play_url.url_list) {
                            results.data.push({
                                type: "audio",
                                name: "audio" + (results.data.filter((x) => x.type == "audio").length + 1), 
                                url: x
                            })
                        }
                        results.status = true
                    } else if (!image_post_info) {
                        for (const x of video.play_addr.url_list) {
                            results.data.push({
                                type: "video",
                                name: "video" + (results.data.length + 1), 
                                url: x
                            })
                        }
                        for (const x of music.play_url.url_list) {
                            results.data.push({
                                type: "audio",
                                name: "audio" + (results.data.filter((x) => x.type == "audio").length + 1), 
                                url: x
                            })
                        }
                        results.status = true
                    } else {
                        results.message = "Failed to fetch tiktok url. Make sure your tiktok url is correct!"
                    }
                } else {
                    results.message = "Failed request"
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            })
        } else {
            results.message = "Failed request"
        }
        return results
    }).catch(() => {
        results.message = "Server sedang maitance..."
        return results
    })
}

const tiktokDLV3 = async (url = "") => {
    const results = { status: false, data: {}, message: "" }
    return await axios.get("https://ttsave.app").then(async (response) => {
        if (response?.status == 200) {
            var $ = cheerio.load(response.data)
            return await axios.post("https://ttsave.app/download?mode=video&key=" + getKeyTiktok($('script[type="text/javascript"]')), { id: url }, {
                "headers": {
                    "User-Agent": "PostmanRuntime/7.31.1"
                }
            }).then(({ status, data }) => {
                if (status == 200) {
                    var $ = cheerio.load(data)
                    var image = []
                    if (data.toString().includes("DOWNLOAD SLIDE")) {
                        for (let x = 1; x < (data.toString().split("DOWNLOAD SLIDE").length); x++) {
                            image.push($("a:contains('DOWNLOAD SLIDE #" + x + "')").attr("href")) 
                        }
                        results.data["author"] = {
                            "name": $("div div h2").text(),
                            "profile": $("div a").attr("href"),
                            "username": $("div a.font-extrabold.text-blue-400.text-xl.mb-2").text()
                        }
                        results.data["details"] = {
                            "thumbnail": $('a[type="cover"]').attr("href"),
                            "views": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(1) span").text(),
                            "loves": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(2) span").text(),
                            "comments": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(3) span").text(),
                            "shares": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(4) span").text(),
                        }
                        results.data["download"] = {
                            "type": "image", 
                            "image": image, 
                            "audio": $("a:contains('DOWNLOAD AUDIO (MP3)')").attr("href")
                        }
                        results.status = true
                    } else {
                        results.data["author"] = {
                            "name": $("div div h2").text(),
                            "profile": $("div a").attr("href"),
                            "username": $("div a.font-extrabold.text-blue-400.text-xl.mb-2").text()
                        }
                        results.data["details"] = {
                            "thumbnail": $('a[type="cover"]').attr("href"),
                            "views": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(1) span").text(),
                            "loves": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(2) span").text(),
                            "comments": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(3) span").text(),
                            "shares": $("div.flex.flex-row.items-center.justify-center.gap-2.mt-2 div:nth-child(4) span").text(),
                        }
                        results.data["download"] = {
                            "type": "video", 
                            "video": $("a:contains('DOWNLOAD (WITHOUT WATERMARK)')").attr("href"), 
                            "audio": $("a:contains('DOWNLOAD AUDIO (MP3)')").attr("href")
                        }
                        results.status = true
                    }
                } else {
                    results.message = "Failed request"
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            })
        } else {
            results.message = "Failed request"
        }
        return results
    }).catch(() => {
        results.message = "Server sedang maitance..."
        return results
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
    const spotify = new Spotify({ 
        "clientId": "7579589d9a0a42a9bcc7de03798f2884", 
        "clientSecret": "cdae1edb68f84bfb8b9b2390062a5e70" 
    })
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
    tiktokDLV2, 
    tiktokDLV3, 
    githubDLV1, 
    spotifyDLV1, 
}