const { default: axios } = require("axios") 
const { getCookieTiktok } = require("./function.js") 

const tiktokStalkerV1 = async (userName = "") => {
    const cheerio = (await import("cheerio")).default
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

const gameStalkerV1 = async (game, users_id, server_id) => {
    const results = { status: false, data: {}, message: "" }
    if (game.toLowerCase() == "free fire") {
        if (!users_id) {
            results.message = "Masukan users id"
            return results
        }
        return await axios.get("https://api.isan.eu.org/nickname/ff?id=" + users_id).then(({ status, data }) => {
            if (status == 200 && data.success) {
                results.data["game"] = game.toLowerCase()
                results.data["name"] = data.name
                results.data["id"] = users_id
                results.status = true
            } else if (status == 200) {
                results.message = "Username not found"
            } else {
                results.message = "Failed status code " + status
            }
            return results
        }).catch(async () => {
            return await axios.get("https://api.isan.eu.org/nickname/ff?id=1888914689").then(({ status, data }) => {
                if (status == 200) {
                    results.message = "Username not found"
                } else {
                    results.message = "Failed status code " + status
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            }) 
        })
    } else if (game.toLowerCase() == "genshin impact") {
        if (!users_id) {
            results.message = "Masukan users id"
            return results
        }
        return await axios.get("https://api.isan.eu.org/nickname/gi?id=" + users_id).then(({ status, data }) => {
            if (status == 200 && data.success) {
                results.data["game"] = game.toLowerCase()
                results.data["name"] = data.name
                results.data["id"] = users_id
                results.status = true
            } else if (status == 200) {
                results.message = "Username not found"
            } else {
                results.message = "Failed status code " + status
            }
            return results
        }).catch(async () => {
            return await axios.get("https://api.isan.eu.org/nickname/gi?id=600000000").then(({ status, data }) => {
                if (status == 200) {
                    results.message = "Username not found"
                } else {
                    results.message = "Failed status code " + status
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            }) 
        })
    } else if (game.toLowerCase() == "point blank") {
        if (!users_id) {
            results.message = "Masukan users id"
            return results
        }
        return await axios.get("https://api.isan.eu.org/nickname/pb?id=" + users_id).then(({ status, data }) => {
            if (status == 200 && data.success) {
                results.data["game"] = game.toLowerCase()
                results.data["name"] = data.name
                results.data["id"] = users_id
                results.status = true
            } else if (status == 200) {
                results.message = "Username not found"
            } else {
                results.message = "Failed status code " + status
            }
            return results
        }).catch(async () => {
            return await axios.get("https://api.isan.eu.org/nickname/pb?id=wakwaw55").then(({ status, data }) => {
                if (status == 200) {
                    results.message = "Username not found"
                } else {
                    results.message = "Failed status code " + status
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            }) 
        })
    } else if (game.toLowerCase() == "super sus") {
        if (!users_id) {
            results.message = "Masukan users id"
            return results
        }
        return await axios.get("https://api.isan.eu.org/nickname/sus?id=" + users_id).then(({ status, data }) => {
            if (status == 200 && data.success) {
                results.data["game"] = game.toLowerCase()
                results.data["name"] = data.name
                results.data["id"] = users_id
                results.status = true
            } else if (status == 200) {
                results.message = "Username not found"
            } else {
                results.message = "Failed status code " + status
            }
            return results
        }).catch(async () => {
            return await axios.get("https://api.isan.eu.org/nickname/sus?id=15916600").then(({ status, data }) => {
                if (status == 200) {
                    results.message = "Username not found"
                } else {
                    results.message = "Failed status code " + status
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            }) 
        })
    } else if (game.toLowerCase() == "arena of valor") {
        if (!users_id) {
            results.message = "Masukan users id"
            return results
        }
        return await axios.get("https://api.isan.eu.org/nickname/aov?id=" + users_id).then(({ status, data }) => {
            if (status == 200 && data.success) {
                results.data["game"] = game.toLowerCase()
                results.data["name"] = data.name
                results.data["id"] = users_id
                results.status = true
            } else if (status == 200) {
                results.message = "Username not found"
            } else {
                results.message = "Failed status code " + status
            }
            return results
        }).catch(async () => {
            return await axios.get("https://api.isan.eu.org/nickname/aov?id=124590895269021").then(({ status, data }) => {
                if (status == 200) {
                    results.message = "Username not found"
                } else {
                    results.message = "Failed status code " + status
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            }) 
        })
    } else if (game.toLowerCase() == "mobile legends") {
        if (!users_id) {
            results.message = "Masukan users id"
            return results
        } else if (!server_id) {
            results.message = "Masukan server id"
            return results
        }
        return await axios.get("https://api.isan.eu.org/nickname/ml?id=" + users_id + "&zone=" + server_id).then(({ status, data }) => {
            if (status == 200 && data.success) {
                results.data["game"] = game.toLowerCase()
                results.data["name"] = data.name
                results.data["id"] = users_id
                results.data["zone"] = server_id
                results.status = true
            } else if (status == 200) {
                results.message = "Username not found"
            } else {
                results.message = "Failed status code " + status
            }
            return results
        }).catch(async () => {
            return await axios.get("https://api.isan.eu.org/nickname/ml?id=1114917746&zone=13486").then(({ status, data }) => {
                if (status == 200) {
                    results.message = "Username not found"
                } else {
                    results.message = "Failed status code " + status
                }
                return results
            }).catch(() => {
                results.message = "Server sedang maitance..."
                return results
            }) 
        })
    } else {
        results.message = "Games not found"
        return results
    }
}

module.exports = {
    tiktokStalkerV1, 
    githubStalkerV1, 
    gameStalkerV1
}