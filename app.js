const express = require('express')
const app = express()
const port = 3000
const nomenclatoareUrl = 'https://flowx-admin-qa.pprflw.qualitance.dev/nomenclators/internal/api/v1'
const cmsBaseUrl = 'https://flowx-admin-qa.dev.rd.flowx.ai/cms/api'
const axios = require('axios');
const e = require('express')
const token = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI2NExaOEwza3ZpQnQwR010cjNVQzFxRTZhcEItWjRRcUFxQjJKdjRwY2lrIn0.eyJleHAiOjE2MjgwOTAyNDcsImlhdCI6MTYxOTQ1MDI0NywianRpIjoiYzRmNTc1YTYtODFiMS00MDFhLWI0ZTgtMDNkZTRiZTA2YTJmIiwiaXNzIjoiaHR0cHM6Ly9hdXRoLXFhLnBwcmZsdy5xdWFsaXRhbmNlLmRldi9hdXRoL3JlYWxtcy9wYXBlcmZsb3ciLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiZmEwYjc2MmEtZTdkOS00ZjY3LWFlMmYtNTI3MTRkYjdmNmE2IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoicGFwZXJmbG93Iiwic2Vzc2lvbl9zdGF0ZSI6ImY5OTE3Zjk1LTE1NzUtNDQ1Zi1iN2UyLWJmMjQ2NGY2MjFkMiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJST0xFX0NPUE9fVklFV0VSIiwiUk9MRV9VU0VSIiwiUk9MRV9DT1BPX1RFTExFUiIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6InNlcmJhbiBjaGlyaWNlc2N1IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VyYmFuQGZsb3d4LmFpIiwiZ2l2ZW5fbmFtZSI6InNlcmJhbiIsImZhbWlseV9uYW1lIjoiY2hpcmljZXNjdSIsImVtYWlsIjoic2VyYmFuQGZsb3d4LmFpIn0.UzIqk4I8XnUNybLh2TsocLX5qeNnCl_fJyVbg4JOCTw7MzcyJBZL4sQIXdsxVkBDyqU7Yiv8kOaZ-P2BbkkrAtOR27dIHucCuvnOzgRI6eeOzrtn7xxOsQ65Ll4-iBVlSO6ZXIFSi0yFXO-2wJ-qyLsZGmnp5DV-jKggXeSwtyEUPiziDyfKFjHmHk7w3hLeYJ8USY9zY1Rn6Cx9BabU375HCQTkjO28qAEzyYpuuhIli-SjGdHouDz1ZykfDLBAuCw4CGV2TuJ19JHYSmp1mMEUC5g0FZD-33MmYKU86aIfRP52hz183Q0uwkSWOHCRAMXvVWiBz9aB_BC_aJzqpQ'
var languages;
var sourceSystems;

app.get('/', (req, response) => {

    getLanguages().then(lng => {
        console.log(`Lang values: `, lng)
        languages = lng;

        getSourceSystems().then(src => {
            console.log(`sourceSystems values: `, src)
            sourceSystems = src;

            getNomenclators().then(nomenclators => {
                //for (nomenclator of nomenclators) {
                var nomenclator = nomenclators.find(x => {
                    if (x.name == 'country') {
                        return true
                    } else return false
                }
                )
                console.log(`Got nomenclator with id: ${nomenclator.id}, name: ${nomenclator.name}`);
                getValuesForNomenclator(nomenclator.id, nomenclator.name)


                //}
                response.send('a mers')
            })
        })
    })


})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

async function getValuesForNomenclator(nomenclatorID, name) {
    values = await getNomenclatorValues(nomenclatorID)
        var n = await printNomenclator(nomenclatorID, name, values)
        console.log(`Nomenclator: ${n.name}`)
        if (n.values.length > 0) {
            console.log(`Nomenclator: ${n.name} with numberOfValues: ${n.values.length}`)
        }
        enumeration = createEnumeration(n)
        console.log("_____________")
        //console.log(enumeration)
        console.log("_____________")
        postNewEnum(enumeration)
        return enumeration.description
    
}

function getNomenclators() {
    return axios.get(`${nomenclatoareUrl}/nomenclators`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}


async function getNomenclatorValues(id) {
    return axios.get(`${nomenclatoareUrl}/nomenclator/${id}/values`)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            console.log('Error: ', err.message);
        });
}

async function printNomenclator(nomenclatorID, name, values) {
    var nomenclator = {}
    nomenclator.name = name
    nomenclator.id = nomenclatorID
    nomenclator.values = []
    
    for (value of values) {
        if (value.sourceSystem == 'COPO') {
            if (value.nomenclatorId != null) {
                var description = await getValuesForNomenclator(value.nomenclatorId, `${nomenclator.name}-${value.value}`)
                value.description = description
                nomenclator.values.push(value)
            }
            else {
                nomenclator.values.push(value)
            }
        }
    }
    return nomenclator;
}

function getLanguages() {
    return axios.get(`${cmsBaseUrl}/taxonomies/languages/flowx`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        return res.data.values
    }).catch(err => {
        console.log('Error: ', err.message);
    });
}

function getSourceSystems() {
    return axios.get(`${cmsBaseUrl}/taxonomies/sourceSystems/flowx`, {
        headers: {
            Authorization: token
        }
    }).then(res => {
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        return res.data.values
    }).catch(err => {
        console.log('Error: ', err.message);
    });
}

function createEnumeration(n) {

    var newEnumaration = {};
    newEnumaration.description = buildDescription(n.name)
    newEnumaration.contentValues = buildContentValues(n.values)
    return newEnumaration;
}

function postNewEnum(enumeration) {
    axios.post(`${cmsBaseUrl}/contents`, JSON.stringify(enumeration), {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    }).then(res => {
        const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
        return res.data.values
    }).catch(err => {
        // what now?
        console.log(err)
    })
}

function buildDescription(name) {
    var description = {
        "name": name,
        "application": "flowx",
        "version": 1
    }
    return description;
}

function buildContentValues(oldValues) {
    var newValues = [];

    for (oldValue of oldValues) {
        var newValue = {
            "type": "value",
            "order": 1,

            "code": oldValue.value
        }
        if (oldValue.description != null) {
            newValue.childContentDescription = oldValue.description
            console.log(newValue)
        }
        newValue.contentMap = createConfigMap(newValue.code, languages)
        newValue.sourceSystems = createConfigMap(newValue.code, sourceSystems)
        newValues.push(newValue)
    }
    return newValues
}

function createConfigMap(value, array) {
    map = {}
    for (item of array) {
        map[item.code] = `${value}-${item.code}`
    }
    return map
}