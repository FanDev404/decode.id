const os = require("os") 
const fs = require("fs") 
const crypto = require("crypto") 
const ffmpeg = require("fluent-ffmpeg") 
const webpmux = require("node-webpmux") 
const { fromBuffer } = require("file-type")    
const { default: axios } = require("axios") 
const { basename, join } = require("path")
const { calender, fetchBuffer } = require("./function.js")

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
            var { status, buffer, message } = await imageToWebp(content) 
        } else if (ext == "mp4" || ext == "gif" || ext == "mov") {
            var { status, buffer, message } = await videoToWebp(content) 
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
            "emojis": Array.isArray(metadata?.categories)? metadata.categories : ["😋"], 
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

module.exports = {
    imageToWebpV1, 
    videoToWebpV1, 
    writeExifV1
}