const Discord   = require('discord.js');
const { query } = require('../../mysql.js');
const methods   = require('../../utils/methods.js');
const os        = require('os');

module.exports = {
    name: 'eval',
    aliases: [''],
    description: 'Admin-only command.',
    hasArgs: true,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: true,
    
    execute(message, args, prefix){
        let commandInput = message.content.substring(6);
        
        try{
            let evaled = eval(commandInput);
            if(typeof evaled !== "string") evaled = require("util").inspect(evaled);
            message.channel.send(evaled, {code:"x1"});
        }
        catch(err){
            message.reply("Something went wrong: ```"+err+"```");
        }
    },
}