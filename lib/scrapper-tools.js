const { default: axios } = require("axios") 

const chatGPTV1 = async (text, apikey) => {
    const results = { status: false, data: "", message: "" }
    return await axios({ 
        "method": "POST", 
        "url": "https://api.openai.com/v1/completions", 
        "data": { 
            "model": "text-davinci-003", 
            "prompt": text, 
            "max_tokens": 1000, 
            "temperature": 0 
        },
        "headers": { 
            "accept": "application/json", 
            "Content-Type": "application/json", 
            "Accept-Language": "in-ID",
            "Authorization": "Bearer " + apikey
        }
    }).then((response) => {
        if (response.status == 200) {
            const { choices } = response.data
            if (choices && choices.length) {
                results.data = choices[0].text
                results.status = true
            }
        } else {
            results.message = "Server sedang maitance..."
        }
        return results
    }).catch((error) => {
        if (error.message.includes("401")) {
            results.message = "key kosong ka minta sama owner buat isi"
        } else if (error.message.includes("429")) {
            results.message = "Not access key"
        } else {
            results.message = "Error : " + error.message
        }
        return results
    })
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
}