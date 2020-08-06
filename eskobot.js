/* eslint-disable brace-style */
// Load up the discord.js library
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const Sequelize = require('sequelize');

/*
 DISCORD.JS VERSION 12 CODE
*/

// TO-DOS


// TODO: USER HISTORY: Function to send (reason) to user database
/* Using Sequentialize and SQLite3
visit https://discordjs.guide/sequelize/#alpha-connection-information
*/

// TODO: LOGGING Mod history in a channel

// TODO: LOGGING: Logging for edited and deleted messages

// TODO: ERROR: change server messages for bot to dm for errors

// TODO: HELP: help should be dm as well

// TODO: REFACTORING: Module check for staff rather than function feature

// TODO: TICKETS: Modmail Bot
/* TODO: Modmail bot:
/ Ticket Channel Category
/ bot responds to dms with a placeholder
- User messages bot => bot creates channel in ticket channel
- Staff are pinged on ticket open
- !close {reason} closes the ticket
- tickets have an embed for a todo script for handling
- !reply [reply] sends a response to the user => so staff can discuss the ticket
- anti spam on ticket
- anti group chat for bot */

// TODO: BAN APPEAL: Ban Appeals google docs

// TODO: LOGGING: Logs vc join and leave


const client = new Discord.Client();

// sequelize initialization

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// Set up table and tags (TESTING)

const Tags = sequelize.define('tags', {
    userid: Sequelize.INTEGER,
    username: Sequelize.STRING,
    punishment: Sequelize.STRING,
    reason: Sequelize.STRING,
    punishmentTime: Sequelize.INTEGER,
});




// Grabs commands folder files to import into an array
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Cooldowns initialization for later
const cooldowns = new Discord.Collection();


// Bot start
client.on('ready', () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

// sync Sequelize tags table
Tags.sync();

client.on('guildCreate', guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on('guildDelete', guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});


// CLIENT ON MESSAGE

client.on('message', message => {

    // Message event, constant
    // ignore bots/self
    if (message.author.bot) return;

    // split command and args, args being sliced array
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Cooldown check
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


    // Server only command check
    if (!command && message.channel.type !== 'text') {
        message.reply('test');
    } else if (message.content.startsWith(prefix) && command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (!command) return;

    // Arguments check => args-info.js
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);

    }


    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;


    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);


    try {
        command.execute(client, message, args, Tags);
    } catch (error) {
        console.error(error);
        message.reply(`Couldn't execute that command because of \`${error}\``);
    }
});


client.login(token);