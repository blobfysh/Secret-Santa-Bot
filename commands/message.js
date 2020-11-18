const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'message',
    aliases: [''],
    description: 'Message your secret gifter or giftee.',
    hasArgs: true,
    requirePartner: true,
    worksInDM: true,
    forceDMsOnly: true,
    modOnly: false,
    adminOnly: false,

    async execute(message, args, prefix){
        const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];
        const gifterRow = (await query(`SELECT * FROM users WHERE partnerId = ${message.author.id}`))[0];
        const exchangeRow = (await query(`SELECT * FROM users INNER JOIN exchange ON users.exchangeId = exchange.exchangeId WHERE userId = ${message.author.id}`))[0];

        if(row.exchangeId == 0) return message.reply('You aren\'t in a Secret Santa.');

        else if(!args.length) return message.reply('You need to specify who you\'re going to message! `' + prefix + 'message <gifter/giftee> <message to send>`.\n\ngiftee - The person you were chosen to get a gift for (<@' + row.partnerId + '>).\ngifter - The person gifting you');

        else if(args[0] !== 'giftee' && args[0] !== 'gifter') return message.reply('You need to specify who you\'re going to message! `' + prefix + 'message <gifter/giftee> <message to send>`.\n\ngiftee - The person you were chosen to get a gift for (<@' + row.partnerId + '>).\ngifter - The person gifting you');

        else if(args[0] == 'giftee'){
            const gifteeEmbed = new Discord.MessageEmbed()
            .setTitle('__You received an anonymous message from your Secret Santa!__')
            .setDescription('\n' + args.slice(1).join(' '))
            .setColor(config.embeds_color)
            .setFooter('You can respond with ' + prefix + 'message gifter <message>')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/father-christmas_1f385.png')

            try{
                const giftee = await message.client.users.fetch(row.partnerId);
                await giftee.send(getAttachments(message, gifteeEmbed));

                message.reply('Successfully sent your message anonymously to <@' + row.partnerId + '>!');
            }
            catch(err){
                message.reply('Error sending message: ```' + err + '```');
            }
        }
        else if(args[0] == 'gifter'){
            const gifterEmbed = new Discord.MessageEmbed()
            .setTitle('__You received a message from your giftee ' + message.author.tag + '!__')
            .setDescription('\n' + args.slice(1).join(' '))
            .setColor(config.embeds_color)
            .setFooter('You can respond with ' + prefix + 'message giftee <message>')
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/incoming-envelope_1f4e8.png')

            try{
                const gifter = await message.client.users.fetch(gifterRow.userId);
                await gifter.send(getAttachments(message, gifterEmbed));

                message.reply('Successfully sent message to your gifter!');
            }
            catch(err){
                message.reply('Error sending message: ```' + err + '```');
            }
        }
    },
}

function getAttachments(message, embed){
    let imageAttached = message.attachments.array();

    if(Array.isArray(imageAttached) && imageAttached.length){
        if(imageAttached[0].url.endsWith(".mp4") || imageAttached[0].url.endsWith(".mp3")){
            embed.addField('File', imageAttached[0].url);
            return {files: [imageAttached[0].url], embed: embed};
            //attachURL = `{name: "File", value: "${imageAttached[0].url}"},`;
            //embedFile = `files: [{attachment: "${imageAttached[0].url}"}], embed: `;
        }
        else{
            embed.setImage(imageAttached[0].url);
            return embed;
        }
    }

    return embed;
}