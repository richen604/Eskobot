/* eslint-disable brace-style */
// Load up the discord.js library
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, staffLog } = require('./config.json');
const Sequelize = require('sequelize');
const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
	maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
	warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
	kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
	maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
	exemptPermissions: [ 'ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS'], // Bypass users with any of these permissions.
	ignoreBots: true, // Ignore bot messages.
	verbose: true, // Extended Logs from module.
	ignoredUsers: [], // Array of User IDs that get ignored.
	// And many more options... See the documentation.
});

/*
 DISCORD.JS VERSION 12 CODE
*/

const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// sequelize initialization

const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: 'database.sqlite',
});

// Set up table and tags (TESTING)

const punishmentLog = sequelize.define('punishmentLog', {
    userid: Sequelize.INTEGER,
    username: Sequelize.STRING,
    punishment: Sequelize.STRING,
    reason: Sequelize.STRING,
    punishmentTime: Sequelize.INTEGER,
    staffName: Sequelize.STRING,
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
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
punishmentLog.sync();

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

    antiSpam.message(message);
    // split command and args, args being sliced array
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // command init
    const command = client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));


    // Server only command check
    if (!command && message.channel.type !== 'text') {
        // Insert Modmail logic here
        message.reply('test');
    } else if (!command) { return;
    } else if (message.content.startsWith(prefix) && command.guildOnly && message.channel.type !== 'text') {
        return message.reply('I can\'t execute that command inside DMs!');
    }

    if (!command && !message.content.startsWith(prefix)) return;

    if (!command.staffRoles){
    } else if (command.staffRoles){
        if (!message.member.roles.cache.some(r => command.staffRoles.includes(r.name))) {
            return message.reply('Sorry, you don\'t have permissions to use this!');
        }
    }

    // Arguments and staff check => args-info.js
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage && command.staffRoles) {
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
        command.execute(client, message, args, punishmentLog);
    } catch (error) {
        console.error(error);
        message.reply(`Couldn't execute that command because of \`${error}\``);
    }

    // logs punishment if log is true in module
    //FIXME log continues even if error
    if (command.log) {
        try {
            async function f() {
                const log = await punishmentLog.create({
                    userid: message.author.id,
                    username: args[0],
                    punishment: command.name,
                    reason: args.slice(1).join(' '),
                    staffName: `<@${message.author.id}>`,
                });
                // sends to channel in MOOC server for staff log
                const channel = client.channels.cache.get(staffLog)
                if (channel) {
                    channel.send(`id\: ${log.id} \| user\: ${log.username} \| ${log.punishment} for ${log.reason} | Done by Staff: ${log.staffName}`)
                }
                return message.reply(`Log ${log.username} added.`);
                
            }
            f()
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That log already exists.');
            }
            console.log(e)
             return message.reply("Something went wrong with adding a log.");
        }
    }

});

// AntiSpam Error Logging

antiSpam.on("error", (message, error, type) => {
	console.log(`${message.author.tag} couldn't receive the sanction '${type}', error: ${error}`);
});

// Client Reaction listener

client.on('messageReactionAdd', async (reaction, user) => {

    // TODO put these in config.json
    const lfgVote = '735951916621627472'
    const contentVote = '735951123898302614'
    const getRoles = '744536926757060683'
    const rules = '735537345981579457'
    
    // only listen for reactions in channels we want to handle reactions
    if (!reaction.message.channel.id === (lfgVote || contentVote || getRoles || rules)) return;
    // if partial check
	if (reaction.partial) {
		// try catch for fetching
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}
    
    // TODO Add Rules / Welcome Function
    // Rules / Welcome Function
    if (reaction.message.id === '745376506364297316' && reaction.emoji.name === '📚'); {
        // Find role Pupil and add it to the user
        const role = reaction.message.guild.roles.cache.find(role => role.name === 'Pupil');
        const member = reaction.message.guild.members.cache.find(u => u.user === user);
        member.roles.add(role);
    }

    // TODO Add Roles Add Function
    // Roles Add Function

    // TODO Add Vote Add Function
    // Vote Add Function

    
}); 

client.on('messageReactionRemove', async (reaction, user) => {

    // TODO put these in config.json
    const lfgVote = '735951916621627472'
    const contentVote = '735951123898302614'
    const getRoles = '744536926757060683'
    const rules = '735537345981579457'

    // only listen for reactions in channels we want to handle reactions
    if (reaction.message.channel.id !== (lfgVote || contentVote || getRoles || rules)) return;
	// if partial check
	if (reaction.partial) {
		// try catch for fetching
		try {
			await reaction.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}
    
    // TODO Add Roles Removal Function
    // Roles Removal Function

    // TODO Add Vote Removal Function
    // Vote Removal Function

    
}); 


// Client message delete logger

client.on('messageDelete', async message => {

    if (message.partial) {
		// try catch for fetching
		try {
			await message.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}


    const deleteChannel = client.channels.cache.get('744966412262703265')
    // TODO add check for guild / change const for edit channel
    // ignore direct messages
    if (!message.guild) return;
    // FIXME message returns null when deleted before bot restart
    if (message === null) return deleteChannel.send(`Probably tried to delete a message before bot restart, won't log`)
    if (message.author.bot) return;

	deleteChannel.send(`A message by ${message.author} was deleted, but we don't know by who: \n\`${message.content}\``);
});

// Client message edit logger

client.on('messageUpdate', async (oldMessage, newMessage) => {

    if (oldMessage.partial) {
		// try catch for fetching
		try {
			await oldMessage.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
	}


    // FIXME oldMessage / newMessage returns null when editing before bot restart
    // TODO add check for guild / change const for edit channel
    if (!oldMessage.guild) return;
    if (oldMessage === null) return deleteChannel.send(`Probably tried to edit a message before bot restart, won't log`)
    if (oldMessage.author.bot) return;

    const editChannel = client.channels.cache.get('744966289310744668')

    editChannel.send(`${oldMessage.author} edited a message: \nOld Message\: \`${oldMessage.content}\` \nNew Message\: \`${newMessage.content}\``)

});


client.login(token);