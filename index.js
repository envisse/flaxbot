"use strict";

if (require('./load-env').error) {
    let err = new Error('Error loading configuration. Did you forgot to get the .env file?');
    console.error(err);
    process.exit(1);
}

const bot = new (require('discord.js').Client)();

bot.login(process.env.DISCORD_BOT_TOKEN)
    .catch(e => {
        console.error('Failed to login with provided token, contact the owner.');
        process.exit(1);
    });

bot.on('ready', () => {
    console.log('Connection established.');
});

bot.on('message', message => {
    console.log('Incoming message', message);
});
