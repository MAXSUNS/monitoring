var http = require('http');
var request = require("request");
var schedule = require("node-schedule");
var fs = require('fs');
var path = require('path');
var config = require('config');
var checkService = require('./services/checkService');
var environments = config.get('environments');

function initAll() {
    for (let environment of environments) {
        setInterval(() => checkService.getEurekaInfo(environment,path.join(__dirname, 'public/eureka/')),"10000");
    }
}

module.exports = {
    initAll: initAll
}
