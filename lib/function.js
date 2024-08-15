const fs = require("fs") 
const util = require("util") 
const path = require("path") 
const cheerio = require("cheerio")
const moment = require("moment-timezone") 
const { fromBuffer } = require("file-type")    
const { default: axios } = require("axios") 

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function randomCode(cmd) {
    let teks = ""
    let code1 = ["Q","W","E","R","T","Y","U","I","O","P","A","S","D","F","G","H","J","K","L","Z","X","C","V","B","N","M"]
    let code2 = ["M","N","B","V","C","X","Z","L","K","J","H","G","F","D","S","A","P","O","I","U","Y","T","R","E","W","Q"]
    let code3 = ["q","w","e","r","t","y","u","i","o","p","a","s","d","f","g","h","j","k","l","z","x","c","v","b","n","m"]
    let code4 = ["m","n","b","v","c","x","z","l","k","j","h","g","f","d","s","a","p","o","i","u","y","t","r","e","w","q"]
    let code5 = ["1","2","3","4","5","6","7","8","9","0"]
    let code6 = ["0","9","8","7","6","5","4","3","2","1"]
    if (cmd == undefined) {
        return pickRandom(code1) + pickRandom(code2) + pickRandom(code3) + pickRandom(code4) + pickRandom(code5) + pickRandom(code6) + pickRandom(code5) + pickRandom(code4) + pickRandom(code3) + pickRandom(code2) + pickRandom(code1) + pickRandom(code1) + pickRandom(code2) + pickRandom(code3) + pickRandom(code4) + pickRandom(code5) + pickRandom(code6) + pickRandom(code5) + pickRandom(code4) + pickRandom(code3) + pickRandom(code2) + pickRandom(code1)
    } else if (!isNaN(cmd)) for(let x = 0; x < cmd; x++) {
        teks += pickRandom(code1)
        teks += pickRandom(code2)
        teks += pickRandom(code3)
        teks += pickRandom(code4)
        teks += pickRandom(code5)
        teks += pickRandom(code6)
    }
    return teks
}

function isUrl(url) {
    try{
        return (url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "gi"))).length? true : false
    } catch {
        return false
    }
}

function isFiles(PATH) {
    if (fs.existsSync(PATH)) {
        try{
            return Buffer.isBuffer(fs.readFileSync(PATH)) 
        } catch {
            return false
        }
    } else return undefined
}

function isBase64(string) {
    return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(string)
}

function calender() {
    return moment().locale("id").tz("Asia/Jakarta").format("dddd, DD MMMM YYYY")
}

async function fetchBuffer(string) {
    const results = { status: false, buffer: null, message: "" }
    if (isUrl(string)) {
        return await axios({
            "method": "GET", 
            "url": string, 
            "headers": { 
                "DNT": 1,
                "Upgrade-Insecure-Request": 1
            },
            "responseType": "arraybuffer"
        }).then((response) => {
             if (response.status == 200) {
                results.status = true
                results.buffer = response.data
             } else {
                results.message = "Server Maitance..."
             }
             return results
        }).catch(() => {
             results.message = "Server Maitance..."
             return results
        })
    } else if (Buffer.isBuffer(string)) {
        results.status = true
        results.buffer = string
        return results
    } else if (isBase64(string)) {
        results.status = true
        results.buffer = Buffer.from(string, "base64")
        return results
    } else if (isFiles(string)) {
        results.status = true
        results.buffer = fs.readFileSync(string)
        return results
    } else {
        results.message = "Buffer not accept"
        return results
    }
}

function decodeSnapAppInstagram(args) {
    let [h, u, n, t, e, r] = args
    function decode (d, e, f) {
        let g = Array.from("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/") 
        let h = g.slice(0, e)
        let i = g.slice(0, f)
        let j = Array.from(d).reverse().reduce(function (a, b, c) {
            if (h.indexOf(b) !== -1)
            return a += h.indexOf(b) * (Math.pow(e, c))
        }, 0)
        let k = ""
        while (j > 0) {
            k = i[j % f] + k
            j = (j - (j % f)) / f
        }
        return k || "0"
    }
    r = ""
    for (let i = 0, len = h.length; i < len; i++) {
        let s = ""
        while (h[i] !== n[e]) {
            s += h[i]; i++
        }
        for (let j = 0; j < n.length; j++)
        s = s.replace(new RegExp(n[j], "g"), j.toString())
        r += String.fromCharCode(decode(s, e, 10) - t)
    }
    return decodeURIComponent(encodeURIComponent(r))
}
  
function getEncodedSnapAppInstagram(data) {
    return data.split("decodeURIComponent(escape(r))}(")[1].split("))")[0].split(",").map((x) => x.replace(/"/g, '').trim())
}

function getDecodedSnapSaveInstagram(data) {
    return data.split('getElementById("download-section").innerHTML = "')[1].split('"; document.getElementById("inputData").remove(); ')[0].replace(/\\(\\)?/g, "")
}

function decryptSnapSaveInstagram(data) {
    return getDecodedSnapSaveInstagram(decodeSnapAppInstagram(getEncodedSnapAppInstagram(data)))
}

const getYoutubeID = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([\w\-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
        return match[1];
    } else {
        return "VideoId tidak ditemukan";
    }
}


module.exports = {
    isUrl, 
    randomCode, 
    pickRandom, 
    isFiles, 
    calender, 
    isBase64, 
    fetchBuffer, 
    getYoutubeID, 
    decryptSnapSaveInstagram, 
}