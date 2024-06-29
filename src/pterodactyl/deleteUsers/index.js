const { deleteUsersV1 } = require("../../../lib/scrapper-pterodactyl.js") 
module.exports = async (server = "", metadata = { application_key: "", id: 1 }, options = { version: "v1" }) => {
    const results = { 
        "creator": "https://wa.me/6289674310267", 
        "status": false, 
        "data": {}, 
        "message": ""
    }
    if (!Object.keys(options).includes("version") || options?.version !== "v1") {
        results.message = "version not valid"
        return results
    }
    switch (options?.version) {
        case "v1":
            return await deleteUsersV1(server.trim(), metadata).then(({ status, message }) => {
                if (status) {
                    results.message = message
                    results.status = true
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