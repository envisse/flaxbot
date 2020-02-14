"use strict";

const Discord = require('discord.js');

const random = (lowerBound, upperBound) => Math.floor((Math.random() * upperBound) + lowerBound);

const getRandomHexColor = () => Number(`0x${Math.floor(Math.random() * 0xFFFFFF).toString(16)}`);

const composeDiscordMessage = message => {
    return new Discord.RichEmbed({
        title: `💬${message.chat.title} | From: **${message.from.first_name} ${message.from.last_name}**, @**${message.from.username}** |`,
        color: getRandomHexColor(),
        description: message.text
    });
};

module.exports = {
    random,
    getRandomHexColor,
    composeDiscordMessage
};
