"use strict";

if (require('./load-env').error) {
    let err = new Error('Error loading configuration. Did you forgot to get the .env file?');
    console.error(err);
    process.exit(1);
}

const Discord = require('discord.js');
const SlimBot = require('slimbot');

const util = require('./util');

const discordBot = new Discord.Client();
discordBot.login(process.env.DISCORD_BOT_TOKEN);

const DISCORD_CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
let discordChannel;

discordBot.on('ready', () => {
    discordChannel = discordBot.channels.find(e => e.id === DISCORD_CHANNEL_ID);
});

const telegramBot = new SlimBot(process.env.TELEGRAM_BOT_TOKEN);
const TELEGRAM_GROUP_ID = Number(process.env.TELEGRAM_GROUP_ID);
telegramBot.startPolling();

discordBot.on('message', message => {
    if (message.member.id !== discordBot.user.id) {
        telegramBot.sendMessage(TELEGRAM_GROUP_ID, message.content);
    }
});

telegramBot.on('message', data => {

    if (data.chat.id === TELEGRAM_GROUP_ID) {
        let message = util.composeDiscordMessage(data);
        discordChannel.send(message);
    }

});
