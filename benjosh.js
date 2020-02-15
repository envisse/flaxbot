const Discord = require('discord.js');

const util = require('./util');

class Benjo {
    constructor(discordClient, telegramClient) {
        this._setupDiscord(discordClient);
        this._setupTelegram(telegramClient);

        this.benjos = ['343382940904062976', '460084926935597076'];
        this.admins = [
            '148116256321568769', //dnzrx
            '294467310343815168', //darma
            '230813214982668288', //michaelice
        ];
        this.commands = [
            {
                'name': 'Execute',
                'commands': ['run', 'exec', 'eval'],
                'help': 'Executes a script',
                'elevated': true,

                'process': (sender, command, content) => {
                    let success = false;
                    let result = null;
                    try {
                        result = (() => eval(content))();
                        success = true;
                    }
                    catch (err) {
                        console.error(`ExecutionCommandError: Failed to execute given script! Details: ${err}.`);
                        result = err;
                    }

                    return [success, result];
                },
                'response': {
                    'discord': (message, result) => {

                    }
                }
            },
            {
                'name': 'Change Prefix',
                'commands': ['pre', 'prefix'],
                'help': 'Changes bot call prefix',
                'elevated': true,

                'process': (sender, command, content) => {
                    this.prefix = content.toLowerCase().trim() + ' ';
                }
            },
            {
                'name': 'Gambling',
                'commands': ['bet', 'gamble'],
                'help': 'Do gambling (beta)',

                'process': (sender, command, content) => {
                    let r1 = Math.floor(Math.random() * 12) + 1;
                    let r2 = Math.floor(Math.random() * 12) + 1;

                    return [r1, r2];
                },
                'response': {
                    'discord': (message, result) => {
                        let embed = new Discord.RichEmbed({
                            title: `${message.author.username}'s gambling game`,
                            color: result[0] > result[1] ? Number('0x28a745') : Number('0xdc3545'),
                            description: result[0] > result[1] ? 'You won' : 'You lost', 
                            fields: [{
                                name: message.author.username, 
                                value: `Rolled \`${result[0]}\``,
                                inline: true,
                            }, {
                                name: 'FLAX', 
                                value: `Rolled \`${result[1]}\``,
                                inline: true,
                            }],
                            footer: {
                                text: 'To win, you must roll higher than me.',
                                icon_url: '',
                            },
                        });
    
                        this.discord.send(message.channel.id, embed);
                        // this.discord.reply(message, result[0] > result[1] ? 'You won' : 'You lost' + `\n\nYou rolled: ${result[0]}\nFLAX rolled: ${result[1]}\n\nTo win, you must roll at least 1 amount higher than the bot.`);
                    }
                }
            },
        ];
        this.prefix = 'benjosh ';
    }

    _setupDiscord(client) {
        client.on('ready', e => console.log('Discord API ready.'));
        client.on('message', m => this.parseDiscord(m));

        // API Abstraction
        this.discord = {
            'send': (channel_id, message) => {
                let channel = client.channels.get(channel_id);
                if (!channel) {
                    console.warn(`DiscordClientWarning: Channel '${channel_id}' unavailable.`);
                    return;
                }

                channel.send(message).catch(e => {
                    console.warn(`DiscordClientWarning: Failed to send message. Reason: ${e}.`);
                });
            },
            'reply': (message, text) => {
                message.reply(text).catch(e => {
                    console.warn(`DiscordClientWarning: Failed to reply to message ID '${message.id}'. Reason: ${e}.`);
                });
            } 
        };
    }

    _setupTelegram(client) {

    }

    parseDiscord(message) {
        let channel_id = message.channel.id;

        let sender = message.author;
        let content = message.content;

        let admin = this.admins.indexOf(sender.id) > -1;

        if (!content.toLowerCase().startsWith(this.prefix.toLowerCase())) return;
        content = content.substr(this.prefix.length);
        let command = content.split(' ')[0].toLowerCase();
        
        for (let _c of this.commands) {
            if ('elevated' in _c && _c.elevated && !admin) continue;

            if (_c.commands.indexOf(command) > -1) {
                content = content.substr(command.length);
                let result = _c.process(sender, command, content);

                if ('response' in _c && 'discord' in _c.response) {
                    _c.response.discord(message, result);
                }
            }
        }
    }
}

module.exports = Benjo;