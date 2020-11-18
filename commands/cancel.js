const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'cancel',
    aliases: ['stop'],
    description: 'Cancels your current Secret Santa, so long as you created it.',
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

        else if(!exchangeRow || exchangeRow.userId !== exchangeRow.creatorId) return message.reply('You can\'t cancel a Secret Santa that you didn\'t create.\n\nAsk `' + (await message.client.users.fetch(exchangeRow.creatorId)).tag + '` to cancel it.');

        await query(`DELETE FROM exchange WHERE exchangeId = ${exchangeRow.exchangeId}`);
        await query(`UPDATE users SET partnerId = 0 WHERE exchangeId = ${exchangeRow.exchangeId}`);
        await query(`UPDATE users SET exchangeId = 0 WHERE exchangeId = ${exchangeRow.exchangeId}`);
        message.reply('Successfully cancelled your Secret Santa.');
    },
}