const youtube = require("yt-search")


const youtubeSearchV1 = async(search) => {
    const results = { status: false, data: [], message: "" }
    return await youtube(search).then(({ videos }) => {
        if (videos.length > 0) {
            results.data = videos
            results.status = true
        } else {
            results.message = "Search not resulted"
        }
        return results
    })
}

module.exports = {
    youtubeSearchV1
}