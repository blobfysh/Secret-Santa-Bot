const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'create',
    aliases: [''],
    description: 'Creates a new secret santa for everyone to join.',
    hasArgs: false,
    requirePartner: false,
    worksInDM: false,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: false,
    guildModsOnly: true,

    async execute(message, args, prefix){
        const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];

        if(row.exchangeId !== 0) return message.reply('You are already in a Secret Santa! Ask the creator of the secret santa to cancel it before making a new one.');

        const embed = new Discord.MessageEmbed()
        .setTitle('__' + message.member.displayName + ' started a new Secret Santa!__')
        .setDescription('React with 🎅 to join!')
        .setFooter(message.member.displayName + ' can draw names with ' + config.prefix + 'start')
        .setColor(config.embeds_color)

        const botMessage = await message.channel.send(embed);
        try{
            await botMessage.react('🎅');
        }
        catch(err){
        }

        await query(`UPDATE users SET exchangeId = ${botMessage.id} WHERE userId = ${message.author.id}`);
        await addNewExchange(botMessage.id, message.author.id);
    },
}

async function addNewExchange(exchangeId, creatorId){
    await query(`INSERT IGNORE INTO exchange (
        exchangeId,
        creatorId,
        started,
        description) VALUES (
            ?, ?, 0,''
        )
    `, [exchangeId, creatorId]);
}