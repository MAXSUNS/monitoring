
var Promise = require("bluebird");
var request = Promise.promisifyAll(require("request"));
const nodemailer = require('nodemailer');

function sendMessage(content,url) {
    this.sendDingMessage(content,url)
}

function sendDingMessage(content,url) {
    var data = {
        msgtype: 'text',
        text: {"content": content}
    }
    var options = {
        url: url,
        body: data,
        json: true
    }
    request.postAsync(options);
}

function sendEmailMessage(content) {
    nodemailer.createTestAccount((err, account) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: config.email.account, // generated ethereal user
                pass: config.email.password  // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'monitoring', // sender address
            to: config.email.receivers, // list of receivers
            subject: 'Hello ✔', // Subject line
            text: content, // plain text body
            html: '<b>'+content+'</b>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
}

module.exports = {
    sendMessage: sendMessage
}
