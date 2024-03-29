const cheerio = require("cheerio")
const { default: axios } = require("axios") 
const { getCookieTiktok } = require("./function.js") 

const tiktokStalkerV1 = async (userName = "") => {
    const results = { status: false, data: {}, message: "" }
    const { status, data, message } = await getCookieTiktok() 
    if (userName.startsWith("@")) userName = userName.replace("@", "")
    if (!status) {
        results.message = message
        return results
    }
    return await axios.get("https://www.tiktok.com/@" + userName.trim(), {
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36",
            "cookie": data
        }
    }).then((response) => {
        if (response.status == 200) {
            const $ = cheerio.load(response.data)
            const result = JSON.parse($("script#__UNIVERSAL_DATA_FOR_REHYDRATION__").text())
            if (!result?.__DEFAULT_SCOPE__?.["webapp.user-detail"]) {
                results.message = "User not found!"
            } else {
                const options = result.__DEFAULT_SCOPE__["webapp.user-detail"].userInfo
                results.data["username"] = options.user.uniqueId
                results.data["nickname"] = options.user.nickname
                results.data["avatarLarger"] = options.user.avatarLarger
                results.data["avatarThumb"] = options.user.avatarThumb
                results.data["avatarMedium"] = options.user.avatarMedium
                results.data["signature"] = options.user.signature
                results.data["verified"] = options.user.verified
                results.data["privateAccount"] = options.user.privateAccount
                results.data["region"] = options.user.region
                results.data["commerceUser"] = options.user.commerceUserInfo.commerceUser
                results.data["usernameModifyTime"] = options.user.uniqueIdModifyTime
                results.data["nicknameModifyTime"] = options.user.nickNameModifyTime
                results.data["followerCount"] = options.stats.followerCount
                results.data["followingCount"] = options.stats.followingCount
                results.data["heartCount"] = options.stats.heartCount
                results.data["videoCount"] = options.stats.videoCount
                results.data["likeCount"] = options.stats.diggCount
                results.data["friendCount"] = options.stats.friendCount
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
}

const githubStalkerV1 = async (userName = "") => {
    const results = { status: false, data: {}, message: "" }
    return await axios.get("https://api.github.com").then(async (response) => {
        if (response.status == 200) {
            return await axios.get("https://api.github.com/users/"+ userName.trim()).then(({ status, data }) => {
                if (status == 200) {
                    results.data = data
                    results.status = true
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

module.exports = {
    tiktokStalkerV1, 
    githubStalkerV1
}