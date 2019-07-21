const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'setwishlist',
    aliases: ['wishlist'],
    description: 'Edit your preferences so your Secret Santa knows what to get you!',
    hasArgs: true,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: true,
    modOnly: false,
    adminOnly: false,
    
    async execute(message, args, prefix){
        var wishlistToSet = args.join(' ');

        if(wishlistToSet.length >= 1000){
            return message.reply('Your wishlist can only be a maximum of 1000 characters long!');
        }

        await query(`UPDATE users SET wishlist = ? WHERE userId = ${message.author.id}`, [wishlistToSet]);

        message.reply('**Successfully set your preferences to:**\n\n' + wishlistToSet);
    },
}