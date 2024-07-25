const fetch = require("node-fetch") 
const { randomCode } = require("./function.js")
const { default: axios } = require("axios") 


const listUsersV1 = async (url, options = { application_key: "" }) => {
    const results = { status: false, data: [], message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationUsers = url.split("/api/application")[0] + "/api/application/users?page=" 
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationUsers = url.split("/api/client")[0] + "/api/application/users?page=" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationUsers = url + "api/application/users?page=" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationUsers = url + "/api/application/users?page=" 
    } else {
        results.message = "Url not valid"
        return results
    }
    return await axios.get(applicationUsers, { 
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + options.application_key
        }
    }).then(async (response) => {
        if (response?.status == 200) {
            for (let x = 1; x <= (response?.data?.meta?.pagination?.total_pages); x++) {
                await axios.get(applicationUsers + x, { 
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + options.application_key
                    }
                }).then(({ status, data }) => {
                    if (status == 200) {
                        for(const o of data.data.map((x) => x.attributes)) {
                            results.data.push(o) 
                        }
                    }
                }) 
            }
            results.message = "Success get all users"
            results.status = true
        } else {
            results.message = "Error code status: " + response?.status
        }
        return results
    }).catch(({ message }) => {
        if (message.endsWith("404")) {
            results.message = "Error : domain not found"
        } else if (message.endsWith("401")) {
            results.message = "Error : apikey not access"
        } else {
            results.message = "Error : " + message
        }
        return results
    })
}

const listServersV1 = async (url, options = { application_key: "" }) => {
    const results = { status: false, data: [], message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationServers = url.split("/api/application")[0] + "/api/application/servers?page="
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationServers = url.split("/api/client")[0] + "/api/application/servers?page="
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationServers = url + "api/application/servers?page="
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationServers = url + "/api/application/servers?page="
    } else {
        results.message = "Url not valid"
        return results
    }
    return await axios.get(applicationServers, { 
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + options.application_key
        }
    }).then(async (response) => {
        if (response?.status == 200) {
            for (let x = 1; x <= (response?.data?.meta?.pagination?.total_pages); x++) {
                await axios.get(applicationServers + x, { 
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + options.application_key
                    }
                }).then(({ status, data }) => {
                    if (status == 200) {
                        for(const o of data.data.map((x) => x.attributes)) {
                            results.data.push(o) 
                        }
                    }
                }) 
            }
            results.message = "Success get all servers"
            results.status = true
        } else {
            results.message = "Error code status: " + response?.status
        }
        return results
    }).catch(({ message }) => {
        if (message.endsWith("404")) {
            results.message = "Error : domain not found"
        } else if (message.endsWith("401")) {
            results.message = "Error : apikey not access"
        } else {
            results.message = "Error : " + message
        }
        return results
    })
}

const listLocationsV1 = async (url, options = { application_key: "" }) => {
    const results = { status: false, data: [], message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationLocations = url.split("/api/application")[0] + "/api/application/locations?page="
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationLocations = url.split("/api/client")[0] + "/api/application/locations?page="
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationLocations = url + "api/application/locations?page="
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationLocations = url + "/api/application/locations?page="
    } else {
        results.message = "Url not valid"
        return results
    }
    return await axios.get(applicationLocations, { 
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + options.application_key
        }
    }).then(async (response) => {
        if (response?.status == 200) {
            for (let x = 1; x <= (response?.data?.meta?.pagination?.total_pages); x++) {
                await axios.get(applicationLocations + x, { 
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + options.application_key
                    }
                }).then(({ status, data }) => {
                    if (status == 200) {
                        for(const o of data.data.map((x) => x.attributes)) {
                            results.data.push(o) 
                        }
                    }
                }) 
            }
            results.message = "Success get all locations"
            results.status = true
        } else {
            results.message = "Error code status: " + response?.status
        }
        return results
    }).catch(({ message }) => {
        if (message.endsWith("404")) {
            results.message = "Error : domain not found"
        } else if (message.endsWith("401")) {
            results.message = "Error : apikey not access"
        } else {
            results.message = "Error : " + message
        }
        return results
    })
}

const listEggsV1 = async (url, options = { application_key: "" }) => {
    const results = { status: false, data: [], message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationNests = url.split("/api/application")[0] + "/api/application/nests?page=" 
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationNests = url.split("/api/client")[0] + "/api/application/nests?page=" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationNests = url + "api/application/nests?page=" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationNests = url + "/api/application/nests?page=" 
    } else {
        results.message = "Url not valid"
        return results
    }
    return await axios.get(applicationNests, { 
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + options.application_key
        }
    }).then(async (response1) => {
        if (response1?.status == 200) {
            for (let a = 1; a <= (response1?.data?.meta?.pagination?.total_pages); a++) {
                await axios.get(applicationNests + a, { 
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + options.application_key
                    }
                }).then(async (response2) => {
                    if (response2?.status == 200) { 
                        for (const b of response2?.data?.data.map((x) => x.attributes)) {
                            await axios.get(`${applicationNests.replace("?page=", "")}/${b.id}/eggs`, { 
                                "headers": {
                                    "Accept": "application/json",
                                    "Content-Type": "application/json",
                                    "Authorization": "Bearer " + options.application_key
                                }
                            }).then(({ status, data }) => {
                                if (status == 200) {
                                    for(const x of data.data.map((x) => x.attributes)) {
                                        results.data.push(x) 
                                    }
                                } 
                                return results
                            })
                        }
                    }
                }) 
            }
            results.message = "Success get all eggs"
            results.status = true
        } else {
            results.message = "Error code status: " + response1?.status
        }
        return results
    }).catch(({ message }) => {
        if (message.endsWith("404")) {
            results.message = "Error : domain not found"
        } else if (message.endsWith("401")) {
            results.message = "Error : apikey not access"
        } else {
            results.message = "Error : " + message
        }
        return results
    })
}

const getUsersV1 = async (url, options = { application_key: "", id: 1 }) => {
    const results = { status: false, data: "", message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID users not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationUsers = url.split("/api/application")[0] + "/api/application/users/" 
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationUsers = url.split("/api/client")[0] + "/api/application/users/" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationUsers = url + "api/application/users/" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationUsers = url + "/api/application/users/" 
    } else {
        results.message = "Url not valid"
        return results
    }
    const { status, data, message } = await listUsersV1(applicationUsers, { "application_key": options.application_key }) 
    if (status == false) {
        results.message = message
        return results
    }
    if (data.filter((x) => (x.id == options.id || x.uuid == options.id)).length > 0) {
        results.data = data.find((x) => (x.id == options.id || x.uuid == options.id))
        results.message = "Success get users"
        results.status = true
    } else {
        results.message = "ID users not found"
    }
    return results
}

const getServersV1 = async (url, options = { application_key: "", id: 1 }) => {
    const results = { status: false, data: "", message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID servers not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationServers = url.split("/api/application")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationServers = url.split("/api/client")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationServers = url + "api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationServers = url + "/api/application/servers/"
    } else {
        results.message = "Url not valid"
        return results
    }
    const { status, data, message } = await listServersV1(applicationServers, { "application_key": options.application_key }) 
    if (status == false) {
        results.message = message
        return results
    }
    if (data.filter((x) => (x.id == options.id || x.uuid == options.id)).length > 0) {
        results.data = data.find((x) => (x.id == options.id || x.uuid == options.id))
        results.message = "Success get servers"
        results.status = true
    } else {
        results.message = "ID servers not found"
    }
    return results
}

const getLocationsV1 = async (url, options = { application_key: "", id: 1 }) => {
    const results = { status: false, data: "", message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID locations not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationServers = url.split("/api/application")[0] + "/api/application/locations/"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationServers = url.split("/api/client")[0] + "/api/application/locations/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationServers = url + "api/application/locations/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationServers = url + "/api/application/locations/"
    } else {
        results.message = "Url not valid"
        return results
    }
    const { status, data, message } = await listLocationsV1(applicationServers, { "application_key": options.application_key }) 
    if (status == false) {
        results.message = message
        return results
    }
    if (data.filter((x) => x.id == options.id).length > 0) {
        results.data = data.find((x) => x.id == options.id)
        results.message = "Success get locations"
        results.status = true
    } else {
        results.message = "ID locations not found"
    }
    return results
}

const getEggsV1 = async (url, options = { application_key: "", id: 1 }) => {
    const results = { status: false, data: "", message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID eggs not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationNests = url.split("/api/application")[0] + "/api/application/nests/"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationNests = url.split("/api/client")[0] + "/api/application/nests/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationNests = url + "api/application/nests/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationNests = url + "/api/application/nests/"
    } else {
        results.message = "Url not valid"
        return results
    }
    const { status, data, message } = await listEggsV1(applicationNests, { "application_key": options.application_key }) 
    if (status == false) {
        results.message = message
        return results
    }
    if (data.filter((x) => (x.id == options.id || x.uuid == options.id)).length > 0) {
        results.data = data.find((x) => (x.id == options.id || x.uuid == options.id))
        results.message = "Success get eggs"
        results.status = true
    } else {
        results.message = "ID eggs not found"
    }
    return results
}

const createUsersV1 = async (url, options = { application_key: "", username: "", first_name: "", last_name: "", password: "", email: "", isAdmins: false }) => {
    const results = { status: false, data: "", message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationUsers = url.split("/api/application")[0] + "/api/application/users" 
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationUsers = url.split("/api/client")[0] + "/api/application/users" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationUsers = url + "api/application/users" 
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationUsers = url + "/api/application/users" 
    } else {
        results.message = "Url not valid"
        return results
    }
    const usersName = (options?.username? options.username : randomCode(1)).toString().trim()
    const usersEmail = ((options?.email && options?.email.endsWith("@gmail.com"))? options.email : options?.email? (options.email + "@gmail.com") : usersName + "@gmail.com").toString().trim()
    const usersPassword = (options?.password? options.password : randomCode()).toString().trim()
    if (options?.password == "") {
        var optionsAccount = JSON.stringify({
            "email": usersEmail,
            "username": usersName, 
            "first_name": options?.first_name? options.first_name : usersName + "@" + usersPassword, 
            "last_name": usersName, 
            "language": "en", 
            "root_admin": options?.isAdmins === true, 
        }) 
    } else {
        var optionsAccount = JSON.stringify({
            "email": usersEmail,
            "username": usersName, 
            "first_name": options?.first_name? options.first_name : usersName + "@" + usersPassword, 
            "last_name": options?.last_name? options.last_name : usersPassword, 
            "language": "en", 
            "root_admin": options?.isAdmins === true, 
            "password": usersPassword
        }) 
    }
    const response = await listUsersV1(url, { "application_key": options.application_key }) 
    if (response?.status == false) {
        results.message = response.message
        return results
    }
    if (response.data.filter((x) => (x.username == usersName || x.email == usersEmail)).length > 0) {
        results.message = "Account sudah ada"
        return results
    }
    return await axios.post(applicationUsers, optionsAccount, {
        "headers": {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + options.application_key
        }
    }).then(({ status, data }) => {
        if (status == 201) {
            results.data = data.attributes
            results.message = "Success create users"
            results.status = true
        } else {
            results.message = "Failed request code status: " + status
        }
        return results
    }).catch(({ message }) => {
        results.message = "Error : " + message
        return results
    })
}

const createServersV1 = async (url, options = { application_key: "", username: "", servername = "", first_name: "", last_name: "", password: "", email: "", isAdmins: false, id: 1, egg: 16, locations: 1, create: "1GB", memory: 0, cpu: 0, disk: 0 }) => {
    const results = { status: false, data: {}, message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationUsers = url.split("/api/application")[0] + "/api/application/users" 
        var applicationNests = url.split("/api/application")[0] + "/api/application/nests"
        var applicationServers = url.split("/api/application")[0] + "/api/application/servers"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationUsers = url.split("/api/client")[0] + "/api/application/users" 
        var applicationNests = url.split("/api/client")[0] + "/api/application/nests"
        var applicationServers = url.split("/api/client")[0] + "/api/application/servers"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationUsers = url + "api/application/users" 
        var applicationNests = url + "api/application/nests"
        var applicationServers = url + "api/application/servers"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationUsers = url + "/api/application/users" 
        var applicationNests = url + "/api/application/nests"
        var applicationServers = url + "/api/application/servers"
    } else {
        results.message = "Url not valid"
        return results
    }
    if (options?.create && !isNaN(parseInt(options?.create)) && options?.create.trim().toUpperCase().endsWith("GB")) {
        var memory = String(Number(1024 * parseInt(options?.create))) 
        var cpu = String(Number(((parseInt(options?.create) - 1) * 20) + 30)) 
        var disk = String(Number(1024 * parseInt(options?.create))) 
    } else if (options?.memory && options?.cpu && options?.disk) {
        var memory = String(options.memory) 
        var cpu = String(options.cpu) 
        var disk = String(options.disk) 
    } else {
        var memory = "0"
        var cpu = "0"
        var disk = "0"
    }
    const usersName = (options?.username? options.username : randomCode(1)).toString().trim()
    const usersEmail = ((options?.email && options?.email.endsWith("@gmail.com"))? options.email : options?.email? (options.email + "@gmail.com") : usersName + "@gmail.com").toString().trim()
    const usersPassword = (options?.password? options.password : randomCode()).toString().trim()
    if (options?.password == "") {
        var optionsAccount = JSON.stringify({
            "email": usersEmail,
            "username": usersName, 
            "first_name": options?.first_name? options.first_name : usersName + "@" + usersPassword, 
            "last_name": usersName, 
            "language": "en", 
            "root_admin": options?.isAdmins === true, 
        }) 
    } else {
        var optionsAccount = JSON.stringify({
            "email": usersEmail,
            "username": usersName, 
            "first_name": options?.first_name? options.first_name : usersName + "@" + usersPassword, 
            "last_name": options?.last_name? options.last_name : usersPassword, 
            "language": "en", 
            "root_admin": options?.isAdmins === true, 
            "password": usersPassword
        }) 
    }
    const response1 = await listUsersV1(url, { "application_key": options.application_key }) 
    const response2 = await getEggsV1(applicationNests, { "application_key": options.application_key, "id": options?.egg }) 
    if (response1?.status == false) {
        results.message = response1?.message
        return results
    } else if (response2?.status == false) {
        results.message = response2?.message
        return results
    }
    if (options?.id && response1.data.filter((x) => (x.id == options?.id || x.uuid == options?.id)).length > 0) {
        const users = response1.data.find((x) => (x.id == options?.id || x.uuid == options?.id))
        const { docker_image, startup } = response2?.data
        const optionsServer = JSON.stringify({
            "name": options?.servername? options.servername.trim() : (users.username + " " + (options?.create.toString().trim().toUpperCase().endsWith("GB")? options?.create : "")).trim(),
            "description": "",
            "user": users.id,
            "egg": parseInt(options?.egg),
            "docker_image": docker_image,
            "startup": startup,
            "environment": {
                "INST": "npm",
                "USER_UPLOAD": "0",
                "AUTO_UPDATE": "0",
                "CMD_RUN": "npm start"
            },
            "limits": {
                "memory": memory,
                "swap": "0",
                "disk": disk,
                "io": "500",
                "cpu": cpu
            },
            "feature_limits": {
                "databases": "5",
                "backups": "5",
                "allocations": "1"
            },
            "deploy": {
                "locations": [parseInt(options?.locations? options?.locations : "1")],
                "dedicated_ip": false,
                "port_range": []
            }
        })
        const post = await fetch(applicationServers, {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.application_key
            }, 
            "body": optionsServer
        }) 
        const { errors, attributes } = await post.json()
        if (errors) {
            results.message = errors[0]
        } else {
            results.data["users"] = users
            results.data["servers"] = attributes
            results.message = "Success create servers"
            results.status = true
        }
        return results
    } else if (response1.data.filter((x) => (x.username == usersName || x.email == usersEmail)).length > 0) {
        const users = response1.data.find((x) => (x.username == usersName || x.email == usersEmail))
        const { docker_image, startup } = response2?.data
        const optionsServer = JSON.stringify({
            "name": (users.username + " " + (options?.create.toString().trim().toUpperCase().endsWith("GB")? options?.create : "")).trim(),
            "description": "",
            "user": users.id,
            "egg": parseInt(options?.egg),
            "docker_image": docker_image,
            "startup": startup,
            "environment": {
                "INST": "npm",
                "USER_UPLOAD": "0",
                "AUTO_UPDATE": "0",
                "CMD_RUN": "npm start"
            },
            "limits": {
                "memory": memory,
                "swap": "0",
                "disk": disk,
                "io": "500",
                "cpu": cpu
            },
            "feature_limits": {
                "databases": "5",
                "backups": "5",
                "allocations": "1"
            },
            "deploy": {
                "locations": [parseInt(options?.locations? options?.locations : "1")],
                "dedicated_ip": false,
                "port_range": []
            }
        })
        const post = await fetch(applicationServers, {
            "method": "POST",
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.application_key
            }, 
            "body": optionsServer
        }) 
        const { errors, attributes } = await post.json()
        if (errors) {
            results.message = errors[0]
        } else {
            results.data["users"] = users
            results.data["servers"] = attributes
            results.message = "Success create servers"
            results.status = true
        }
        return results
    } else {
        return await axios.post(applicationUsers, optionsAccount, { 
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.application_key
            }
        }).then(async (response3) => {
            if (response3?.status == 201) {
                const users = response3.data.attributes
                const { docker_image, startup } = response2?.data
                const optionsServer = JSON.stringify({
                    "name": (users.username + " " + (options?.create.toString().trim().toUpperCase().endsWith("GB")? options?.create : "")).trim(),
                    "description": "",
                    "user": users.id,
                    "egg": parseInt(options?.egg),
                    "docker_image": docker_image,
                    "startup": startup,
                    "environment": {
                        "INST": "npm",
                        "USER_UPLOAD": "0",
                        "AUTO_UPDATE": "0",
                        "CMD_RUN": "npm start"
                    },
                    "limits": {
                        "memory": memory,
                        "swap": "0",
                        "disk": disk,
                        "io": "500",
                        "cpu": cpu
                    },
                    "feature_limits": {
                        "databases": "5",
                        "backups": "5",
                        "allocations": "1"
                    },
                    "deploy": {
                        "locations": [parseInt(options?.locations? options?.locations : "1")],
                        "dedicated_ip": false,
                        "port_range": []
                    }
                })
                const post = await fetch(applicationServers, {
                    "method": "POST",
                    "headers": {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + options.application_key
                    }, 
                    "body": optionsServer
                }) 
                const { errors, attributes } = await post.json()
                if (errors) {
                    results.message = errors[0]
                } else {
                    results.data["users"] = users
                    results.data["servers"] = attributes
                    results.message = "Success create servers"
                    results.status = true
                }
                return results
            } else {
                results.message = "Error code3 status: " + response3?.status
            }
            return results
        }).catch(({ message }) => {
            results.message = "Error : " + message
            return results
        })
    }
}

const deleteUsersV1 = async (url, options = { application_key: "", id: 1 }) => {
    const results = { status: false, message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationUsers = url.split("/api/application")[0] + "/api/application/users/" 
        var applicationServers = url.split("/api/application")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationUsers = url.split("/api/client")[0] + "/api/application/users/" 
        var applicationServers = url.split("/api/client")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationUsers = url + "api/application/users/" 
        var applicationServers = url + "api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationUsers = url + "/api/application/users/" 
        var applicationServers = url + "/api/application/servers/"
    } else {
        results.message = "Url not valid"
        return results
    }
    const response1 = await listUsersV1(applicationUsers, { "application_key": options.application_key }) 
    const response2 = await listServersV1(applicationServers, { "application_key": options.application_key }) 
    if (response1?.status == false) {
        results.message = response1?.message
        return results
    } else if (response2?.status == false) {
        results.message = response2?.message
        return results
    }
    if (response1?.data.filter((x) => (x.id == options.id || x.uuid == options.id)).length > 0) {
        const users = response1?.data.find((x) => (x.id == options.id || x.uuid == options.id))
        const servers = response2?.data.filter((x) => x.user == users.id)
        for (const x of servers) {
            await axios({
                "url": applicationServers + x.id, 
                "method": "DELETE", 
                "headers": {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + options.application_key
                }
            })
        }
        return await axios({
            "url": applicationUsers + users.id, 
            "method": "DELETE", 
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.application_key
            }
        }).then(({ status }) => {
            if (status == 204) {
                results.message = "Success delete users " + options?.id
                results.status = true
            } else {
                results.message = "code error status: " + status
            }
            return results
        }).catch(({ message }) => {
            results.message = "Error : " + error.message
            return results
        })
    } else {
        results.message = "ID not found"
    }
    return results
}

const deleteServersV1 = async (url, options = { application_key: "", id: 1 }) => {
    const results = { status: false, message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationServers = url.split("/api/application")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationServers = url.split("/api/client")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationServers = url + "api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationServers = url + "/api/application/servers/"
    } else {
        results.message = "Url not valid"
        return results
    }
    const response = await listServersV1(applicationServers, { "application_key": options.application_key }) 
    if (response?.status == false) {
        results.message = response?.message
        return results
    }
    if (response?.data.filter((x) => (x.id == options.id || x.uuid == options.id)).length > 0) {
        const servers = response?.data.find((x) => (x.id == options.id || x.uuid == options.id))
        return await axios({
            "url": applicationServers + servers.id, 
            "method": "DELETE", 
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.application_key
            }
        }).then(({ status }) => {
            if (status == 204) {
                results.message = "Success delete servers " + options?.id
                results.status = true
            } else {
                results.message = "code error status: " + status
            }
            return results
        }).catch(({ message }) => {
            results.message = "Error : " + error.message
            return results
        })
    } else {
        results.message = "ID not found"
    }
    return results
}

const updateServersV1 = async (url, options = { application_key: "", id: 1, update: "10GB", memory: 0, cpu: 0, disk: 0 }) => {
    const results = { status: false, data: "", message: "" }
    if (!options?.application_key || options?.application_key && !options?.application_key.startsWith("ptla_")) {
        results.message = "Invalid key"
        return results
    } else if (!options?.id) {
        results.message = "ID servers not valid"
        return results
    }
    if (url.startsWith("https://") && url.includes("/api/application")) {
        var applicationServers = url.split("/api/application")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && url.includes("/api/client")) {
        var applicationServers = url.split("/api/client")[0] + "/api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application") && url.endsWith("/")) {
        var applicationServers = url + "api/application/servers/"
    } else if (url.startsWith("https://") && !url.includes("/api/client") && !url.includes("/api/application")) {
        var applicationServers = url + "/api/application/servers/"
    } else {
        results.message = "Url not valid"
        return results
    }
    if (options?.update && !isNaN(parseInt(options?.update)) && options?.update.toString().trim().toUpperCase().endsWith("GB")) {
        var memory = Number(1024 * parseInt(options?.update))
        var cpu = Number(((parseInt(options?.update) - 1) * 20) + 30)
        var disk = Number(1024 * parseInt(options?.update))
    } else if (options?.memory && options?.cpu && options?.disk) {
        var memory = String(options.memory) 
        var cpu = String(options.cpu) 
        var disk = String(options.disk) 
    } else {
        var memory = 0
        var cpu = 0
        var disk = 0
    }
    const response = await listServersV1(applicationServers, { "application_key": options.application_key }) 
    if (response?.status == false) {
        results.message = response?.message
        return results
    }
    if (response?.data.filter((x) => (x.id == options.id || x.uuid == options.id)).length > 0) {
        const servers = response?.data.find((x) => (x.id == options.id || x.uuid == options.id))
        const optionsServer = JSON.stringify({
            "allocation": servers?.allocation,
            "memory": memory,
            "swap": servers.limits.swap || 0,
            "disk": disk,
            "io": 500,
            "cpu": cpu,
            "threads": null,
            "feature_limits": {
                "databases": 5,
                "allocations": 5,
                "backups": 5
            }
        }) 
        return await axios.patch(`${(applicationServers + servers.id)}/build`, optionsServer, {
            "headers": {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + options.application_key
            }
        }).then(({ status, data }) => {
            if (status == 200) {
                results.data = data.attributes
                results.message = "Success update servers"
                results.status = true
            } else {
                results.message = "code error status: " + status
            }
            return results
        }).catch(({ message }) => {
            results.message = "Error : " + message
            return results
        })
    } else {
        results.message = "ID servers not found"
    }
    return results
}



        
module.exports = {
    listUsersV1, 
    listServersV1, 
    listLocationsV1, 
    listEggsV1, 
    getUsersV1, 
    getServersV1, 
    getLocationsV1, 
    getEggsV1, 
    createUsersV1, 
    createServersV1, 
    deleteUsersV1, 
    deleteServersV1, 
    updateServersV1, 
}