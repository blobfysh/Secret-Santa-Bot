# Secret-Santa-Bot
<p align="center">
  <img width="120" height="120" src="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/father-christmas_1f385.png">
</p>
<p align="center">A Secret Santa bot for Discord!<br><br>
<b align="center">Has features such as:</b> easily starting a Secret Santa that users can join by reacting, creating a wishlist that your Secret Santa can see, and anonymously message your gifter/giftee
<br><br>All data is stored in MySQL so no information is lost when the bot is restarted.
</p>

<h3>Commands</h3>

| Name      |  Description                      | Usage                     |
|:------:   |:---------------------------------:|:-------------------------:|
| `help`    | View all the command, you can also specify a command to get more information.    | `s!help [command]` |
| `create`  | Create a new Secret Santa for everyone to join.    | `s!create` |
| `start`   | Assigns everyone a random partner (use this after you've created).    | `s!start` |
| `setwishlist`| Edit your gift preferences.    | `s!setwishlist <preferences here>` |
| `partnerinfo`| View your partners gift preferences.    | `s!partnerinfo` |
| `participants`| Show a list of who's participating in your Secret Santa.   | `s!participants` |
| `message` | Message your secret gifter or giftee, the bot will hide your name.    | `s!message <gifter/giftee> <message to send>` |
| `cancel` | Cancels your Secret Santa.    | `s!cancel` |
| `info` | View information about the bot like memory usage, server count.    | `s!info` |

<h1 align="center">Self-host Instructions</h1>

### Downloads:

[Node.js](https://nodejs.org/en/download/) (10.0.0 or higher)

[MySQL](https://dev.mysql.com/downloads/installer/)

1. Clone the repository
2. Rename `config_example.json` to `config.json` and add your own token to botToken (You can register a new Discord bot at: https://discordapp.com/developers/applications/)
3. Create a new MySQL database with the same database name you have in `config.json` (Default is secret_santa)
4. Run command prompt in the folder and execute the following:
```shell
npm install
```
After that the bot should be ready! Now just start it:
```shell
node app.js
```
