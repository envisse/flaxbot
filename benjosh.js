const Discord = require('discord.js');

const util = require('./util');

class Benjo {
    constructor(discordClient, telegramClient) {
        this._setupDiscord(discordClient);
        this._setupTelegram(telegramClient);

        this.separator = ' ';
        this.prefix = `benjosh${this.separator}`;

        this.benjos = ['343382940904062976', '460084926935597076'];
        this.admins = [
            '148116256321568769', //dnzrx
            '294467310343815168', //darma
            '230813214982668288', //michaelice
        ];
        this.commands = [
            {
                'name': 'Ping',
                'commands': ['ping'],
                'help': 'Ping server for debugging purposes',
                'category': 'utility',

                'process': (sender, command, content) => {},
                'response': {
                    'telegram': (message, result) => {
                        this.telegram.reply(message, 'Pong!');
                    },
                    'discord': (message, result) => {
                        this.discord.reply(message, 'Pong!');
                    }
                }
            },
            {
                'name': 'Help',
                'commands': ['help'],
                'help': 'An introduction to the bot, including list of commands, and detailed commands help',
                'category': 'utility',

                'process': (sender, command, content) => {},
                'response': {
                    'discord': (message, result) => {
                        let embed = new Discord.RichEmbed({
                            'title': `${message.author.username}'s gambling game`,
                            'color': result[0] > result[1] ? Number('0x28a745') : Number('0xdc3545'),
                            'description': result[0] > result[1] ? 'You won' : 'You lost', 
                            'fields': [{
                                'name': message.author.username, 
                                'value': `Rolled \`${result[0]}\``,
                                'inline': true,
                            }, {
                                'name': 'FLAX', 
                                'value': `Rolled \`${result[1]}\``,
                                'inline': true,
                            }],
                            'footer': {
                                'text': 'To win, you must roll higher than me.',
                                'icon_url': '',
                            },
                        });
    
                        this.discord.send(message.channel.id, embed);
                    }
                }
            },
            {
                'name': 'Change Prefix',
                'commands': ['pre', 'prefix', 'pf'],
                'help': 'Changes bot call prefix',
                'category': 'utility',
                'elevated': true,

                'process': (sender, command, content) => {
                    this.prefix = content.toLowerCase().trim() + ' ';
                }
            },
            {
                'name': 'Gambling',
                'commands': ['bet', 'gamble'],
                'help': 'Do gambling (beta)',
                'category': 'game',

                'process': (sender, command, content) => {
                    let r1 = Math.floor(Math.random() * 12) + 1;
                    let r2 = Math.floor(Math.random() * 12) + 1;

                    return [r1, r2];
                },
                'response': {
                    'discord': (message, result) => {
                        let embed = new Discord.RichEmbed({
                            'title': `${message.author.username}'s gambling game`,
                            'color': result[0] > result[1] ? Number('0x28a745') : Number('0xdc3545'),
                            'description': result[0] > result[1] ? 'You won' : 'You lost', 
                            'fields': [{
                                'name': message.author.username, 
                                'value': `Rolled \`${result[0]}\``,
                                'inline': true,
                            }, {
                                'name': 'FLAX', 
                                'value': `Rolled \`${result[1]}\``,
                                'inline': true,
                            }],
                            'footer': {
                                'text': 'To win, you must roll higher than me.',
                                'icon_url': '',
                            },
                        });
    
                        this.discord.send(message.channel.id, embed);
                    }
                }
            },
        ];
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
        telegramBot.on('message', m => this.parseTelegram(m));

        this.telegram = { //TODO: verify that Telegram API abstraction works as intended
            'reply': (message, text) => {
                client.sendMessage(message.chat.id, text).catch(e => {
                    console.warn(`TelegramClientWarning: Failed to reply to chat ID '${message.chat.id}'. Reason: ${e}.`);
                });
            }
        }
    }

    parseTelegram(message) {
        let sender = {
            'username': message.from.username,
            'name': `${message.from.first_name} ${message.from.last_name}`,
        }
        let content = message.text;
        let admin = false; //TODO: normalize administrator user ID for telegram & discord

        let result = this.parse(sender, content, admin);

        if ('response' in result[0] && 'telegram' in result[0].response) {
            result[0].response.telegram(message, result[1]);
        }
    }

    parseDiscord(message) {
        let sender = {
            'username': message.author.username,
            'name': 'WIP', //TODO: get name if possible
        };
        let content = message.content;
        let admin = this.admins.indexOf(sender.id) > -1;

        let result = this.parse(sender, content, admin);

        if ('response' in result[0] && 'discord' in result[0].response) {
            result[0].response.discord(message, result[1]);
        }
    }

    parse (sender, content, admin) {
        if (!content.toLowerCase().startsWith(this.prefix.toLowerCase())) return;
        content = content.substr(this.prefix.length);
        let command = content.split(this.separator)[0].toLowerCase();
        
        for (let _c of this.commands) {
            if ('elevated' in _c && _c.elevated && !admin) continue;

            if (_c.commands.indexOf(command) > -1) {
                content = content.substr(command.length + this.separator.length);
                return [_c, _c.process(sender, command, content)];
            }
        }
    }
}

module.exports = Benjo;