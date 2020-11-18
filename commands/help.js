const Discord   = require('discord.js');
const { query } = require('../mysql');
const config    = require('../json/config.json');
const methods   = require('../utils/methods');

module.exports = {
    name: 'help',
    aliases: [''],
    description: 'Shows all bot commands.',
    hasArgs: false,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: false,

    async execute(message, args, prefix){
        if(args[0] == undefined){
            var helpArr = message.client.commands.filter(cmd => !cmd.adminOnly && cmd.name !== 'help').map(cmd => '`' + cmd.name + '` - ' + cmd.description);

            const helpEmbed = new Discord.MessageEmbed()
            .setTitle('__Commands__')
            .setDescription(helpArr.map((cmd, index) => (index + 1) + '. ' + cmd))
            .setFooter('Use ' + prefix + 'help <command> to see more about a command.')
            .setColor(config.embeds_color)

            message.channel.send(helpEmbed);
        }
        else{
            const command = message.client.commands.get(args[0]) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));

            if(!command) return message.reply('That command doesn\'t exist.');

            var embedDesc = [command.description];

            if(command.worksInDM) embedDesc.push('This command works in DMs');

            if(command.forceDMsOnly) embedDesc.push('This command only works in DMs');

            if(command.adminOnly) embedDesc.push('This command can only be used by bot admins.');

            if(command.hasArgs) embedDesc.push('This command requires arguments.');

            if(command.requirePartner) embedDesc.push('This command requires that you already have a Secret Santa partner.');

            if(command.guildModsOnly) embedDesc.push('This command requires that you have the `MANAGE_SERVER` permission.');

            const cmdEmbed = new Discord.MessageEmbed()
            .setTitle('__' + (command.name.charAt(0).toUpperCase() + command.name.slice(1)) + ' Command__')
            .setDescription(embedDesc.map(cmd => '- ' + cmd).join('\n\n'))
            .setColor(config.embeds_color)

            if(command.aliases[0].length) cmdEmbed.addField('Aliases', command.aliases);

            message.channel.send(cmdEmbed)
        }
    },
}