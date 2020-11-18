const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'partnerinfo',
    aliases: [''],
    description: 'View information about your partner like gift preferences.',
    hasArgs: false,
    requirePartner: true,
    worksInDM: true,
    forceDMsOnly: true,
    modOnly: false,
    adminOnly: false,

    async execute(message, args, prefix){
        const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];
        const partnerRow = (await query(`SELECT * FROM users WHERE userId = ${row.partnerId}`))[0];
        const wishList = partnerRow.wishlist || 'No preferences.';

        const partnerEmbed = new Discord.MessageEmbed()
        .setTitle('__Partner Information__')
        .setDescription('<@' + row.partnerId + '>\n\nWishlist: ```' + wishList + '```')
        .setColor(config.embeds_color)
        .setFooter('Need more info? Message them with the message command!')

        message.channel.send(partnerEmbed);
    },
}