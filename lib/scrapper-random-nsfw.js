const nsfw_trap = require("../database/nsfw/trap")
const nsfw_neko = require("../database/nsfw/neko")
const nsfw_waifu = require("../database/nsfw/waifu")
const { fetchBuffer, pickRandom } = require("./function.js")

const randomNsfwTrapV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(nsfw_trap) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Trap"
        results.data["category"] = "nsfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomNsfwNekoV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(nsfw_neko) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Neko"
        results.data["category"] = "nsfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomNsfwWaifuV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(nsfw_waifu) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Waifu"
        results.data["category"] = "nsfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

module.exports = {
    randomNsfwTrapV1, 
    randomNsfwNekoV1, 
    randomNsfwWaifuV1
}