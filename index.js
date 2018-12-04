var express = require('express');
const TelegramBot = require('node-telegram-bot-api');

var util = require('util')
//const token = '624345915:AAF1cNuw5E_BE2-ERHa6U_P18ucFwVFBzJk';

// Create a bot that uses 'polling' to fetch new updates
//const bot = new TelegramBot(token, { polling: true });


var bb = require('bot-brother')
var bot = bb({
    key: '624345915:AAF1cNuw5E_BE2-ERHa6U_P18ucFwVFBzJk',
    sessionManager: bb.sessionManager.memory({ dir: '/Users/digital/datay.txt/' }),
    polling: { interval: 10, timeout: false }
})

//start



bot.command('yes').invoke(function (ctx)  {
    
    bot.api.onText(/^\/yes/, function (msg, match) {
    const chatId = msg.chat.id;
    //const resp = match[1];
    var option = {
        "parse_mode": "Markdown",
        "reply_markup": {
            "one_time_keyboard": true,
            "keyboard": [[{
                text: "My phone number",
                request_contact: true
            }], ["Cancel"]]
        }
    };
    bot.api.sendMessage(msg.chat.id, "How can we contact you?", option).then(() => {
        bot.api.on("contact",(msg)=>{
            var option = {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "one_time_keyboard": true,
                    "keyboard": [[{
                        text: "My location",
                        request_location: true
                    }], ["Cancel"]]
                }
            };
            bot.api.sendMessage(msg.chat.id,
                            util.format('Thank you %s with phone %s! And where are you?', msg.contact.first_name, msg.contact.phone_number),
                            option)
            .then(() => {
                bot.api.once("location",(msg)=>{
                    bot.api.sendMessage(msg.chat.id, "We will deliver your order to " + [msg.location.longitude,msg.location.latitude].join(";"));
                })
            })
        })
    })
    return ctx.go('start')

});
})
       



    bot.command('hello').invoke(function (ctx) {
        return ctx.sendMessage('Hello! What is your name?');
      });
      
      
   
   //greetings 

bot.texts({
    hello: {
        world: {
            friend: 'Hello, <%=name%>!'
        }
    }
});



bot.command('start').invoke(function (ctx) {
    ctx.data.name = ctx.meta.user.first_name;
    ctx.sendMessage('hello.world.friend');
    return ctx.go('/^\/place/')

});  
      