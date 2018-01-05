var http = require('http');
var request = require("request");
var schedule = require("node-schedule");
var fs = require('fs');
var messageService = require('./messageService');

var qaE,stagingE,producitonE;
function getEurekaInfo(environment, path) {
    var options = {
        url: environment.eureka_url,
        headers: {
            'Accept': 'application/json'
        }
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            checkInstance(body, environment, path)
        } else {
            // messageService.sendMessage(environment.name + '环境 eureka异常');
        }
    })
}

function checkInstance(data, environment, path) {
    let reg = new RegExp(environment.service_group);
    let services = JSON.parse(data).applications.application;
    let aliveSercice = new Array();
    let resultCheck = new Array();
    for (let service of services) {
        if (reg.test(service.name)) {
            aliveSercice[service.name] = service;
        }
    }
    for (let service of environment.check_service) {
        let instances = new Array();
        let realcount = 0;
        if (!!aliveSercice[service.name]) {
            for (let instance of aliveSercice[service.name].instance) {
                instances.push({
                    "status": instance.status,
                    "lastUpdatedTimestamp": instance.lastUpdatedTimestamp,
                    "hostName": instance.hostName
                })
                realcount++;
            }
        }
        service["instances"] = instances;
        service["realcount"] = realcount;
        resultCheck.push(service);
    }
    sendMessage(resultCheck, environment, path);
    let save = {"data": resultCheck};
    fs.writeFile(path + environment.name + '-eureka.js',
        JSON.stringify(save), function (err) {
            if (err) throw err;
        });

}

function sendMessage(resultCheck, environment, path) {
    var data = {};
    var resultData = {};
    fs.readFile(path + environment.name + '-result.js', function (err, bytesRead) {
        if (err) {
            console.log("未生成检查结果" + environment.name + '-result.js');
        } else {
            data = JSON.parse(bytesRead);
        }
        for (let service of resultCheck) {
            if (service.realcount < service.count ) {
                if (!!data[service.name]) {
                    let alert=data[service.name].alert||false;
                    if(data[service.name].realcount!=service.realcount){
                        alert=false;
                    }
                    if (data[service.name].times >= 3&&!alert) {
                            messageService.sendMessage(environment.name + '环境--' + service.nickname + "  DOWN （"+service.realcount+ "/"+service.count+ "）",environment.ddUrl);
                            alert=true;
                    }
                    resultData[service.name] = {
                        "times": ++data[service.name].times,
                        "time":data[service.name].time,
                        "alert":alert,
                        "realcount":service.realcount,
                    };
                    console.log(resultData)

                } else {
                    resultData[service.name] = {
                        "times": 1,
                        "time":new Date(),
                        "alert":false,
                        "realcount":service.realcount,
                    };
                }
                console.log("检查" + environment.name + '-环境异常');
            } else {
                if (!!data[service.name]&&data[service.name].alert) {
                    messageService.sendMessage(environment.name + '环境--' + service.nickname + "  UP",environment.ddUrl)
                }
            }
        }
        fs.writeFile(path + environment.name + '-result.js',
            JSON.stringify(resultData), function (err) {
                if (err) throw err;
            });
    });

}
module.exports = {
    getEurekaInfo: getEurekaInfo,
    checkInstance: checkInstance
}
