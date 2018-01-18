var http = require('http');
var request = require("request");
var schedule = require("node-schedule");
var fs = require('fs');
var path = require('path');
var config = require('config');
var checkService = require('./services/checkService');
var environments = config.get('environments');

function initAll() {
    //根据配置的default.json，遍历所有设置，每隔10s进行服务健康检查
    for (let environment of environments) {
        setInterval(() => checkService.getEurekaInfo(environment,path.join(__dirname, 'public/eureka/')),"10000");
    }

    /**
     * 读取默认配置文件
     */
    const content = fs.readFileSync(path.join(__dirname, 'config', 'config.json'));
    const defaultConfig = JSON.parse(content);
    let envConfig;

    /**
     * 合并配置项
     * 设置配置为全局变量
     */
    global.config || ( global.config = (envConfig ? _.merge({}, defaultConfig, envConfig) : defaultConfig ));

}

module.exports = {
    initAll: initAll
}
