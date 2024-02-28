const { listLocationsV1 } = require("../../../lib/scrapper-pterodactyl.js") 
module.exports = async (server = "", metadata = { application_key: "" }, options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": [], 
        "message": ""
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await listLocationsV1(server.trim(), metadata).then(({ status, data, message }) => {
                if (status) {
                    results.data = data
                    results.status = true
                    results.message = message
                } else {
                    results.message = message
                }
                return results
            }) 
        break
        default: 
        if (results.message == "") {
            results.message = "Failed request"
        }
        return results
    }
}