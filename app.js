const fs        = require('fs');
const config    = require('./json/config.json');

const Discord = require('discord.js');

const { connectSQL, query } = require('./mysql.js');
const { handleCmd }         = require('./commandhandler.js');

const client = new Discord.Client({
    messageCacheMaxSize: 50,
    messageCacheLifetime: 300,
    messageSweepInterval: 500,
    disableEveryone: true
});

client.sets         = require('./utils/sets.js');
client.commands     = new Discord.Collection();
client.commandsUsed = 0;
client.fullLockdown = true; // Will be disabled after bot starts up.

const commandFiles  = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const adminCommands = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));

for(const file of adminCommands){
    commandFiles.push(`admin/${file}`);
}
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', message => {
    if(message.author.bot) return;
    else if(client.fullLockdown) return console.log('[APP] Ignored message.');
    else if(client.sets.bannedUsers.has(message.author.id)) return;
    else if(!message.content.toLowerCase().startsWith(config.prefix)) return; // Ignore if message doesn't start with prefix.

    if(message.channel.type === "dm") handleCmd(message, config.prefix);
    else handleCmd(message, config.prefix);
});


client.on('error', (err) => {
    console.log(err);
});

client.on('disconnect', (err) => {
    console.log(err);
    client.destroy().then(client.login(config.botToken));
});

/*
client.on('debug', (message) => {
	console.debug(message);
});
*/

client.on('reconnecting', () => {
	console.log('[APP] Bot reconnecting...');
});

client.on('ready', async () => {
    client.user.setActivity(config.prefix + 'help', {type: 'PLAYING'});

    const bannedRows = await query(`SELECT * FROM banned`); // refreshes the list of banned users on startup
    bannedRows.forEach((bannedId) => {
        if(bannedId.userId !== undefined && bannedId.userId !== null){
            client.sets.bannedUsers.add(bannedId.userId);
        }
    });

    console.log(`[APP] Bot is ready`);
    client.fullLockdown = false;
});

process.on('unhandledRejection', (reason, p) => {
	console.error('[APP][' + new Date().toLocaleString(undefined, {timeZone: 'America/New_York'}) + '] Unhandled Rejection: ', reason);
});

client.login(config.botToken);