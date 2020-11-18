const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'start',
    aliases: [''],
    description: 'Assigns everyone a random gift partner!',
    hasArgs: false,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: false,

    async execute(message, args, prefix){
        const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];
        const exchangeRow = (await query(`SELECT * FROM users INNER JOIN exchange ON users.exchangeId = exchange.exchangeId WHERE userId = ${message.author.id}`))[0];

        if(row.exchangeId == 0) return message.reply('You aren\'t in a Secret Santa.');

        else if(!exchangeRow || exchangeRow.userId !== exchangeRow.creatorId) return message.reply('You can\'t start a Secret Santa that you didn\'t create.\n\nAsk `' + (await message.client.users.fetch(exchangeRow.creatorId)).tag + '` to start it.');

        else if(exchangeRow.started == 1) return message.reply('The Secret Santa has already started!');

        await query(`UPDATE exchange SET started = 1 WHERE exchangeId = ${exchangeRow.exchangeId}`);
        const botMsg = await message.reply('Shuffling participants and messaging...');

        await pickRandom(message, exchangeRow.exchangeId, prefix);

        botMsg.edit('Successfully started your Secret Santa!');
    },
}

async function pickRandom(message, exchangeId, prefix){
    const rows = (await query(`SELECT * FROM users WHERE exchangeId = ${exchangeId}`));
    var userIds = [];

    for(var i = 0; i < rows.length; i++){
        userIds.push(rows[i].userId);
    }

    shuffle(userIds);

    for(var i = 0; i < userIds.length; i++){
        var partnerId = i == userIds.length - 1 ? userIds[0] : userIds[i + 1];

        try{
            await query(`UPDATE users SET partnerId = ${partnerId} WHERE userId = ${userIds[i]}`);
            const partnerInfo = (await query(`SELECT * FROM users WHERE userId = ${partnerId}`))[0];
            const user = await message.client.users.fetch(userIds[i]);

            const startEmbed = new Discord.MessageEmbed()
            .setTitle('__Secret Santa Started!__')
            .setDescription('You were chosen to gift: <@' + partnerId + '> 🎄' + (partnerInfo.wishlist == '' ? '' : '\n\nHere\'s their wishlist:\n```' + partnerInfo.wishlist + '```') + '\n\nYou can message them with `' + prefix + 'message giftee <message>`')
            .setFooter('Shhhhhhhhh')
            .setColor(config.embeds_color)

            await user.send(startEmbed)
        }
        catch(err){
            console.log('[START.JS] Unable to fetch a user while picking randomly: ' + err);
        }
    }
}

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}