const os = require("os") 
const fs = require("fs") 
const jimp = require("jimp") 
const crypto = require("crypto") 
const ffmpeg = require("fluent-ffmpeg") 
const cheerio = require("cheerio")
const webpmux = require("node-webpmux") 
const FormData = require("form-data")
const { fromBuffer } = require("file-type")    
const { default: axios } = require("axios") 
const { basename, join } = require("path")
const { calender, fetchBuffer, randomCode } = require("./function.js")



const imageToWebpV1 = async (content) => {
    const results = { status: false, buffer: null, base64: null, message: "" }
    try{
        const { status, buffer, message } = await fetchBuffer(content)
        const tmpFileIn = join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.jpg`)
        const tmpFileOut = join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
        if (!status) {
            results.message = message
            return results
        }
        fs.writeFileSync(tmpFileIn, buffer)
        await new Promise((resolve, reject) => {
            ffmpeg(tmpFileIn)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([
                    "-vcodec",
                    "libwebp",
                    "-vf",
                    "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"
                ])
                .toFormat("webp")
                .save(tmpFileOut)
        })
        results.buffer = fs.readFileSync(tmpFileOut)
        results.base64 = fs.readFileSync(tmpFileOut).toString("base64")
        results.status = true
        fs.unlinkSync(tmpFileOut)
        fs.unlinkSync(tmpFileIn)
        return results
    } catch (error) {
        results.message = String(error) 
        return results
    }
}
        
        

const videoToWebpV1 = async (content) => {
    const results = { status: false, buffer: null, base64: null, message: "" }
    try{
        const { status, buffer, message } = await fetchBuffer(content)
        const tmpFileIn = join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.mp4`)
        const tmpFileOut = join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
        if (!status) {
            results.message = message
            return results
        }
        fs.writeFileSync(tmpFileIn, buffer)
        await new Promise((resolve, reject) => {
            ffmpeg(tmpFileIn)
                .on("error", reject)
                .on("end", () => resolve(true))
                .addOutputOptions([
                    "-vcodec",
                    "libwebp",
                    "-vf",
                    "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse",
                    "-loop",
                    "0",
                    "-ss",
                    "00:00:00",
                    "-t",
                    "00:00:05",
                    "-preset",
                    "default",
                    "-an",
                    "-vsync",
                    "0"
                ])
                .toFormat("webp")
                .save(tmpFileOut)
        })
        results.buffer = fs.readFileSync(tmpFileOut)
        results.base64 = fs.readFileSync(tmpFileOut).toString("base64")
        results.status = true
        fs.unlinkSync(tmpFileOut)
        fs.unlinkSync(tmpFileIn)
        return results
    } catch (error) {
        results.message = String(error) 
        return results
    }
}


const writeExifV1 = async (content, metadata = {}) => {
    const results = { status: false, buffer: null, base64: null, message: "" }
    try{
        const getBuffer = await fetchBuffer(content)
        if (getBuffer.status) {
            var { ext } = await fromBuffer(getBuffer.buffer)
        } else {
            results.message = getBuffer.message
            return results
        }
        if (ext == "jpg" || ext == "jpeg" || ext == "png") {
            var { status, buffer, message } = await imageToWebpV1(content) 
        } else if (ext == "mp4" || ext == "gif" || ext == "mov") {
            var { status, buffer, message } = await videoToWebpV1(content) 
        } else if (ext == "webp") {
            var { status, buffer, message } = await fetchBuffer(content) 
        } else {
            results.message = "Media not found"
            return results
        }
        const tmpFileIn = join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
        const tmpFileOut = join(os.tmpdir(), `${crypto.randomBytes(6).readUIntLE(0, 6).toString(36)}.webp`)
        if (!status) {
            results.message = message
            return results
        }
        fs.writeFileSync(tmpFileIn, buffer)
        const img = new webpmux.Image()
        const object = { 
            "sticker-pack-id": metadata?.packId? metadata.packId : "https://instagram.com/cak_haho",
            "sticker-pack-name": metadata?.packName? metadata.packName : (metadata?.packName && !metadata?.packPublish)? "" : (metadata?.packName && metadata?.packPublish == "")? "" : "fandev404", 
            "sticker-pack-publisher": metadata?.packPublish? metadata.packPublish : (metadata?.packPublish && !metadata?.packName)? "" : (metadata?.packPublish && metadata?.packName == "")? "" : calender(),
            "sticker-pack-publisher-email": metadata?.packEmail? metadata.packEmail : "fandev404@gmail.com",
            "sticker-pack-publisher-website": metadata?.packWebsite? metadata.packWebsite : "https://github.com/FanDev404",
            "android-app-store-link": metadata?.androidApp? metadata.androidApp : "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
            "ios-app-store-link": metadata?.iOSApp? metadata.iOSApp : "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
            "emojis": Array.isArray(metadata?.categories)? metadata.categories : ["??"], 
            "is-avatar-sticker": metadata?.isAvatar? metadata.isAvatar : 0
        }
        const exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
        const jsonBuff = Buffer.from(JSON.stringify(object), "utf-8")
        const exif = Buffer.concat([exifAttr, jsonBuff])
        exif.writeUIntLE(jsonBuff.length, 14, 4)
        await img.load(tmpFileIn)
        img.exif = exif
        await img.save(tmpFileOut)
        results.buffer = fs.readFileSync(tmpFileOut)
        results.base64 = fs.readFileSync(tmpFileOut).toString("base64")
        results.status = true
        fs.unlinkSync(tmpFileOut)
        fs.unlinkSync(tmpFileIn)
        return results
    } catch (error) {
        results.message = String(error) 
        return results
    }
}

const imageToUrlV1 = async (paths) => {
    const results = { status: false, data: "", message: "" }
    const form = new FormData();
    form.append("file", fs.createReadStream(paths))
    return await axios({ 
        "method": "POST",
        "url": "https://telegra.ph/upload", 
        "headers": { 
            ...form.getHeaders() 
        },
        "data": form
    }).then(({ status, data }) => {
        if (status == 200) {
            results.status = true
            results.data = "https://telegra.ph" + data[0].src
        } else {
            results.message = "Server sedang maitance..."
        }
        return results
    }).catch(() => {
        results.message = "Server sedang maitance..."
        return results
    })
}

const uploadFileGithubV1 = async (content, metadata = {}) => {
    const results = { status: false, data: "", message: "" }
    const { status, buffer, message } = await fetchBuffer(content)
    if (status) {
        var { ext } = await fromBuffer(buffer)
    } else {
        results.message = message
        return results
    }
    if (!metadata?.name) {
        results.message = "Name not found!!!!"
        return results
    } else if (!metadata?.repository) {
        results.message = "Repository not found!!!!"
        return results
    } else if (!metadata?.token) {
        results.message = "Token not found!!!!"
        return results
    }
    return await axios({
        "method": "GET",
        "url": "https://api.github.com/users/"+ metadata?.name,
        "headers": {
            "Authorization": "Bearer " + metadata?.token,
            "Content-Type": "application/json"
        }
    }).then(async (response1) => {
        if (response1?.status == 200) {
            return await axios({
                "method": "GET",
                "url": "https://api.github.com/repos/"+ metadata?.name + "/" + metadata?.repository + "/contents",
                "headers": {
                    "Authorization": "Bearer " + metadata?.token,
                    "Content-Type": "application/json"
                }
            }).then(async (response2) => {
                if (response2?.status == 200) {
                    const fileName = (response2.data.filter((x) => x.type == "file").length + 1) + "." + ext
                    return await axios({
                        "method": "PUT",
                        "url": "https://api.github.com/repos/" + metadata?.name + "/" + metadata?.repository + "/contents/" + fileName,
                        "headers": {
                            "Authorization": "Bearer " + metadata?.token,
                            "Content-Type": "application/json"
                        },
                        "data": {
                            "message": "",
                            "content": buffer.toString("base64")
                        }
                    }).then(({ status, data }) => {
                        if (status == 200 || status == 201) {
                            results.data = data.content.download_url
                            results.status = true
                        } else {
                            results.message = "Terjadi kesalahan saat upload!!"
                        }
                        return results
                    }).catch(() => {
                        results.message = "Terjadi kesalahan saat upload!!"
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
}

const removeBackgroundV1 = async (link) => {
    const results = { status: false, data: "", message: "" }
    return await axios.get("https://api.nyxs.pw/tools/removebg?url=" + link).then(({ status, data }) => {
        if (status == 200 && (data.status == true || data.status == "true")) {
            results.data = data.result
            results.status = true
        } else if (status == 200 && (data.status == false || data.status == "false")) {
            results.message = data.message
        } else {
            results.message = "Failed request status " + status
        }
        return results
    }).catch((error) => {
        results.message = "Error : " + error.message
        return results
    })
}

const waifu2xV1 = async (link) => {
    const results = { status: false, data: "", message: "" }
    return await axios.get("https://api.nyxs.pw/tools/hd?url=" + link).then(({ status, data }) => {
        if (status == 200 && (data.status == true || data.status == "true")) {
            results.data = data.result
            results.status = true
        } else if (status == 200 && (data.status == false || data.status == "false")) {
            results.message = data.message
        } else {
            results.message = "Failed request status " + status
        }
        return results
    }).catch((error) => {
        results.message = "Error : " + error.message
        return results
    })
}

const jadiAnimeV1 = async (link) => {
    const results = { status: false, data: "", message: "" }
    return await axios.get("https://api.nyxs.pw/ai-image/jadianime?url=" + link).then(({ status, data }) => {
        if (status == 200 && (data.status == true || data.status == "true")) {
            results.data = data.result
            results.status = true
        } else if (status == 200 && (data.status == false || data.status == "false")) {
            results.message = data.message
        } else {
            results.message = "Failed request status " + status
        }
        return results
    }).catch((error) => {
        results.message = "Error : " + error.message
        return results
    })
}

const editBackgroundV1 = async (content, metadata = {}) => {
    const results = { status: false, base64: null, buffer: null, message: "" }
    const { status, buffer, message } = await fetchBuffer(content)
    if (status) {
        var { ext } = await fromBuffer(buffer)
        if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
            results.message = "Biji lu file " + ext + " mau di remove background"
            return results
        } 
    } else {
        results.message = message
        return results
    }
    if (!metadata?.apikey) {
        results.message = "Apikey not found!!!"
        return results
    } else if (!metadata?.color) {
        results.message = "Color not found!!!"
        return results
    }
    return await axios({ 
         "method": "POST", 
         "url": "https://api.remove.bg/v1.0/removebg", 
         "data": {
             "image_file_b64": buffer.toString("base64"),
             "bg_color": metadata?.color
         },
         "headers": { 
             "accept": "application/json",
             "Content-Type": "application/json",
             "X-Api-Key": metadata?.apikey
         }
     }).then(({ status, data }) => {
         if (status == 200) {
             results.status = true
             results.base64 = data.data.result_b64
             results.buffer = new Buffer.from(data.data.result_b64, "base64")
         } else {
             results.message = "Server sedang error"
         }
         return results
     }).catch((error) => {
         if (error.message.includes("401")) {
             results.message = "Key kosong"
         } else if (error.message.includes("403")) {
             results.message = "Not access key"
         } else {
             results.message = "Error : " + error.message
         }
         return results
     })
}

const resizeImageV1 = async (content, metadata = {}) => {
    const results = { status: false, buffer: null, base64: null, message: "" }
    const { status, buffer, message } = await fetchBuffer(content)
    if (status) {
        var { ext } = await fromBuffer(buffer)
        if (ext !== "jpg" && ext !== "jpeg" && ext !== "png") {
            results.message = "Biji lu file " + ext + " mau di reresize"
            return results
        } 
    } else {
        results.message = message
        return results
    }
    if (!metadata?.width) {
        results.message = "Width not found"
        return results
    } else if (!metadata?.height) {
        results.message = "Height not found"
        return results
    } 
    try{
        const readBuffer = await jimp.read(buffer);
        const response = await readBuffer.resize(Number(metadata?.width), Number(metadata?.height)).getBufferAsync(jimp.MIME_JPEG)
        results.buffer = response
        results.base64 = response.toString("base64")
        results.status = true
        return results
    } catch {
        results.message = "Terjadi kesalahan"
        return results
    }
}

const uploadFileUrlV1 = async (content) => {
    const results = { status: false, data: "", message: "" }
    const { status, buffer, message } = await fetchBuffer(content)
    if (status) {
        var { ext } = await fromBuffer(buffer)
        if (!ext) {
            results.message = "Jenis file tidak di temukan."
            return results
        }
    } else {
        results.message = message
        return results
    }
    const data = new FormData()
    const fileName = randomCode() + "." + ext
    data.append("file", buffer, fileName)
    return await axios.post("https://uploader.nyxs.pw/upload", data, {
        "headers": {
            ...data.getHeaders()
        }
    }).then(({ status, data }) => {
        if (status == 200) {
            const $ = cheerio.load(data)
            const url = $("a").attr("href")
            if (!url) {
                results.message = "URL not found in response"
                return results
            }
            results.data = url
            results.status = true
        } else {
            results.message = "Failed status code " + status
        }
        return results
     }).catch(({ message }) => {
         results.message = "Error : " + message
         return results
     })
}

const upscaleV1 = async (content, size = 2, anime = false) => {
    const results = { status: false, data: "", message: "" }
    const { status, buffer, message } = await fetchBuffer(content)
    if (!status) {
        results.message = message
        return results
    } else if (!/(2|4|6|8|16)/.test(size.toString())) {
        results.message = "invalid upscale size!"
        return results
    }
    return jimp.read(Buffer.from(buffer)).then(async (image) => {
        const { width, height } = image.bitmap;
        const newWidth = width * size;
        const newHeight = height * size;
        const form = new FormData();
        form.append("name", "upscale-" + Date.now())
        form.append("imageName", "upscale-" + Date.now())
        form.append("desiredHeight", newHeight.toString())
        form.append("desiredWidth", newWidth.toString())
        form.append("outputFormat", "png")
        form.append("compressionLevel", "none")
        form.append("anime", anime.toString())
        form.append("image_file", buffer, {
            filename: "upscale-" + Date.now() + ".png",
            contentType: 'image/png',
        })
        return await axios.post("https://api.upscalepics.com/upscale-to-size", form, {
            headers: {
                ...form.getHeaders(),
                origin: "https://upscalepics.com",
                referer: "https://upscalepics.com"
            }
        }).then((response) => {
            if (response.status == 200 && !response.data.error) {
                 results.data = response.data.bgRemoved
                 results.status = true
            } else if (response.status == 200) {
                 results.message = "Server sedang error"
            } else {
                 results.message = "Failed request status " + response.status
            }
            return results
        }).catch((error) => {
            results.message = "Error : " + error.message
            return results
        })
    }) 
}



module.exports = {
    imageToWebpV1, 
    videoToWebpV1, 
    writeExifV1, 
    imageToUrlV1, 
    uploadFileGithubV1, 
    editBackgroundV1, 
    resizeImageV1, 
    uploadFileUrlV1, 
    removeBackgroundV1, 
    waifu2xV1, 
    jadiAnimeV1, 
    upscaleV1
}