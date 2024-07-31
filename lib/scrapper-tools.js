const { fetchBuffer } = require("./function.js")
const { default: axios } = require("axios") 
const { GoogleGenerativeAI } = require("@google/generative-ai")


const chatGPTV1 = async (text) => {
    const results = { status: false, data: "", message: "" }
    return await axios.get("https://api.nyxs.pw/ai/gpt?text=" + encodeURI(text)).then(({ status, data }) => {
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

const chatGPTV1 = async (text) => {
    const results = { status: false, data: "", message: "" }
    return await axios.get("https://api.nyxs.pw/ai/gpt4?text=" + encodeURI(text)).then(({ status, data }) => {
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

const geminiV1 = async (text) => {
    const results = { status: false, data: "", message: "" }
    return await axios.get("https://api.nyxs.pw/ai/gemini?text=" + encodeURI(text)).then(({ status, data }) => {
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

const geminiV2 = async (text, apikey, content, mimeType) => {
    const results = { status: false, data: "", message: "" }
    const { status, buffer, message } = await fetchBuffer(content)
    if (!status) {
        results.message = message
        return results
    }
    try{
        const genAI = new GoogleGenerativeAI(apikey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        const image = {
            "inlineData": {
                "data": buffer.toString("base64"),
                mimeType,
            }
        }
        const { response } = await model.generateContent([text, image])
        results.data = response.text() 
        results.status = true
        return results
    } catch (error) {
        results.message = error
        return results
    }
}

const simsimiV1 = async (text = "", lang = "id") => {
    const results = { status: false, data: {}, message: "" }
    const code_bahasa = [
        "vn", "en", "he", "zh", "ch", "id", "ko", "ph", "ru", "ar", "ms", "es", "pt",
        "de", "th", "ja", "fr", "sv", "tr", "da", "nb", "it", "nl", "fi", "ml", "hi",
        "kh", "ca", "ta", "rs", "mn", "fa", "pa", "cy", "hr", "el", "az", "sw", "te",
        "pl", "ro", "si", "fy", "kk", "cs", "hu", "lt", "be", "br", "af", "bg", "is",
        "uk", "jv", "eu", "rw", "or", "al", "bn", "gn", "kn", "my", "sk", "gl", "gu",
        "ps", "ka", "et", "tg", "as", "mr", "ne", "ur", "uz", "cx", "hy", "lv", "sl",
        "ku", "mk", "bs", "ig", "lb", "mg", "ny", "sn", "tt", "yo", "co", "eo", "ga",
        "hm", "hw", "lo", "mi", "so", "ug", "am", "gd"
    ]
    if (code_bahasa.includes(lang)) {
        const options = new URLSearchParams()
        options.append("text", text)
        options.append("lc", lang)
        return await axios.post("https://api.simsimi.vn/v2/simtalk", options).then(({ status, data }) => {
            if (status == 200) {
                results.data["id"] = data?.id
                results.data["ip"] = data?.ip.split(",").map((x) => x.trim()).filter((x) => x !== "") 
                results.data["request-id"] = data["x-simsimi-request-id"]
                results.data["language"] = data?.language
                results.data["response"] = data?.message
                results.status = true
            } else {
                results.message = "Failed request"
            }
            return results
        }).catch(() => {
            results.message = "Server sedang maitance..."
            return results
        })
    } else {
        results.message = "Failed code language"
        return results
    }
}

module.exports = {
    simsimiV1, 
    chatGPTV1, 
    chatGPTV2, 
    chatGPTV2, 
    geminiV1, 
    geminiV2
}