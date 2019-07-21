const config = require('./json/config.json');
const Discord = require('discord.js');
const { query } = require('./mysql.js');
const methods  = require('./utils/methods');

exports.handleCmd = async function(message, prefix){
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return; // Command doesnt exist

    else if(!command.worksInDM && message.channel.type !== 'text') return message.reply('That command doesn\'t work in DMs!');

    else if(command.forceDMsOnly && message.channel.type !== 'dm') return message.reply('That command only works in DMs!');

    if(message.channel.type !== 'dm') await cacheMember(message);
    if(!(await query(`SELECT * FROM users WHERE userId = ${message.author.id}`)).length) await methods.createNewUser(message.author.id); // Create new account in database for user BEFORE executing a command.
    
    const row = (await query(`SELECT * FROM users WHERE userId = ${message.author.id}`))[0];

    if(command.requirePartner && row.partnerId == 0) return message.reply('A partner has not been chosen for you yet! Try again after you\'ve been given a partner.');

    else if(command.guildModsOnly && !message.member.hasPermission("MANAGE_GUILD")) return message.reply('You need the `MANAGE_SERVER` permission to run that command.');
    
    else if(command.adminOnly && !message.client.sets.adminUsers.has(message.author.id)) return message.reply('You must be an admin of the bot to run that command.');

    try{
        command.execute(message, args, prefix); // CALL COMMAND HERE
        message.client.commandsUsed++;
    }
    catch(err){
        console.error(err);
        message.reply('Command failed to execute!');
    }
}

async function cacheMember(message){
    try{
        if(!message.member){
            console.log('[CMD] Fetching member...');
            await message.guild.fetchMember(message.author);
        }
    }
    catch(err){
        console.log('[CMD] Failed to fetch a member: ' + err);
    }
}