"use strict";

if (require('./load-env').error) {
    let err = new Error('Error loading configuration. Did you forgot to get the .env file?');
    console.error(err);
    process.exit(1);
}

const discordbot = new (require('discord.js').Client)();
const telegrambot = new (require('slimbot'))(process.env.TELEGRAM_BOT_TOKEN);

telegrambot.on('message', message => {
    telegrambot.sendMessage(message.chat.id, 'Message received');
});

telegrambot.startPolling();

discordbot.login(process.env.DISCORD_BOT_TOKEN)
    .catch(e => {
        console.error('Failed to login with provided token, contact the owner.');
        process.exit(1);
    });

discordbot.on('ready', () => {
    console.log('Connection established.');
});

discordbot.on('message', message => {

});
