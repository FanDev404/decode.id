const sfw_neko = require("../database/sfw/neko")
const sfw_maid = require("../database/sfw/maid")
const sfw_awoo = require("../database/sfw/awoo")
const sfw_oppai = require("../database/sfw/oppai")
const sfw_waifu = require("../database/sfw/waifu")
const sfw_selfies = require("../database/sfw/selfies")
const sfw_shinobu = require("../database/sfw/shinobu")
const sfw_uniform = require("../database/sfw/uniform")
const sfw_megumin = require("../database/sfw/megumin")
const sfw_mori_calliope = require("../database/sfw/mori-calliope")
const sfw_raiden_shogun = require("../database/sfw/raiden-shogun")
const sfw_marin_kitagawa = require("../database/sfw/marin-kitagawa")
const { fetchBuffer, pickRandom } = require("./function.js")

const randomSfwNekoV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_neko) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Neko"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwMaidV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_maid) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Maid"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwAwooV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_awoo) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Awoo"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwOppaiV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_oppai) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Oppai"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwWaifuV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_waifu) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Waifu"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwSelfiesV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_selfies) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Selfies"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwShinobuV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_shinobu) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Shinobu"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwUniformV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_uniform) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Uniform"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwMeguminV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_megumin) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Megumin"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwMoriCalliopeV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_mori_calliope) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Mori calliope"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwRaidenShogunV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_raiden_shogun) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Raiden shogun"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

const randomSfwMarinKitagawaV1 = async () => {
    const results = { status: false, data: {}, message: "" }
    const { url } = pickRandom(sfw_marin_kitagawa) 
    const { status, buffer, message } = await fetchBuffer(url)
    if (status) {
        results.data["name"] = "Marin kitagawa"
        results.data["category"] = "sfw"
        results.data["buffer"] = buffer
        results.data["base64"] = buffer.toString("base64")
        results.status = true
    } else {
        results.message = message
    }
    return results
}

module.exports = {
    randomSfwNekoV1, 
    randomSfwMaidV1, 
    randomSfwAwooV1, 
    randomSfwOppaiV1, 
    randomSfwWaifuV1, 
    randomSfwSelfiesV1, 
    randomSfwShinobuV1, 
    randomSfwUniformV1, 
    randomSfwMeguminV1, 
    randomSfwMoriCalliopeV1, 
    randomSfwRaidenShogunV1, 
    randomSfwMarinKitagawaV1
}