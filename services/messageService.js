
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
function sendMessage(service,url) {
    var data = {
        msgtype: 'text',
        text: {"content": service}
    }
    var options = {
        url: url,
        body: data,
        json: true
    }
    request.postAsync(options);
}
module.exports = {
    sendMessage: sendMessage
}
