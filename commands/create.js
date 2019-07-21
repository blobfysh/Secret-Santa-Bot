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

        const embed = new Discord.RichEmbed()
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

        const collector = botMessage.createReactionCollector((reaction, user) => user.id !== message.author.id && reaction.emoji.name === '🎅');

        collector.on("collect", async reaction => {
            var users = reaction.users.filter(user => !user.bot).map(user => user.id);

            for(var i = 0; i < users.length; i++){
                const row = (await query(`SELECT * FROM users WHERE userId = ${users[i]}`))[0];

                if(!row) await methods.createNewUser(users[i]);

                else if(!((await query(`SELECT * FROM exchange WHERE exchangeId = ${botMessage.id}`))[0])) collector.stop();

                else if(((await query(`SELECT * FROM exchange WHERE exchangeId = ${botMessage.id}`))[0]).started == 1) collector.stop();
                
                else if(row.exchangeId == 0){
                    await query(`UPDATE users SET exchangeId = ${botMessage.id} WHERE userId = ${users[i]}`);

                    const joinEmbed = new Discord.RichEmbed()
                    .setTitle('__Successfully joined ' + message.author.username + '\'s Secret Santa!__')
                    .setDescription('I will let you know when names are drawn!')
                    .setColor(config.embeds_color)
                    
                    const user = await message.client.fetchUser(users[i]);

                    user.send(joinEmbed);
                }
            }
        });
        collector.on("end", reaction => {
        });
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