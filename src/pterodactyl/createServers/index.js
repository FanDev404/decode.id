const { createServersV1 } = require("../../../lib/scrapper-pterodactyl.js") 
module.exports = async (server = "", metadata = { application_key: "", id: 1, username: "", servername: "", first_name: "", last_name: "", password: "", email: "", isAdmins: false, egg: 15, locations: 1, create: "1GB" }, options = { version: "v1" }) => {
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
            return await createServersV1(server.trim(), metadata).then(({ status, data, message }) => {
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