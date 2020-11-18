const Discord     = require('discord.js');
const { version } = require('../package.json');
const os          = require('os');
const config      = require('../json/config.json');

module.exports = {
    name: 'info',
    aliases: ['botinfo', 'update', 'version', 'stats'],
    description: 'Displays various information about the bot.',
    hasArgs: false,
    requirePartner: false,
    worksInDM: true,
    forceDMsOnly: false,
    modOnly: false,
    adminOnly: false,

    async execute(message, args, prefix){
        var used = process.memoryUsage().heapUsed / 1024 / 1024;

        const embedInfo = new Discord.MessageEmbed()
        embedInfo.setTitle(`**Secret Santa Info**`)
        embedInfo.setColor(config.embeds_color)
        embedInfo.setThumbnail("https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/father-christmas_1f385.png")
        embedInfo.setDescription('Secret Santa bot made by [blobfysh](https://github.com/blobfysh).')
        embedInfo.addField("Active Servers", message.client.guilds.cache.size, true)
        embedInfo.addField("Version", "`" + version +"`", true)
        embedInfo.addField("Memory Usage", Math.round(used) + "/" + Math.round(os.totalmem() / 1024 / 1024) + " MB", true)
        embedInfo.addField("Creators", "blobfysh#4679", true)
        message.channel.send(embedInfo);
    },
}