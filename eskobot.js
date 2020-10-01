/* eslint-disable brace-style */
// Load up the discord.js library
const fs = require('fs');
const ms = require('ms')
const Discord = require('discord.js');
const { 
    prefix, token, staffLogChannel, strengthsMessageID, interestsMessageID, lfgHubParentID, contentHubParentID,
    lfgVoteChannel, contentVoteChannel, rolesChannel, rulesChannel, strengthsObj, interestsObj, rulesMessageID, guildID

} = require('./config.json');
const Sequelize = require('sequelize');
const AntiSpam = require('discord-anti-spam');
const strengths = require('./commands/strengths');
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
	ignoreBots: false, // Ignore bot messages.
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
    userid: Sequelize.STRING,
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
//TODO create a reaction debug that reacts to rulesMessageID
client.on('ready', async () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
    client.user.setActivity(`Message me for help!`);
    //TODO find a way to do a quick react/unreact feature to debug listeners 
});

// sync Sequelize tags table
punishmentLog.sync();

client.on('guildCreate', guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Message me for help!`);
});

client.on('guildDelete', guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Message me for help!`);
});


// CLIENT ON MESSAGE

client.on('message', async message => {

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
    //MODMAIL FUNCTION
    if (!command && message.channel.type !== 'text') {
        // TODO Insert Modmail logic here

        let guild = client.guilds.cache.get(`731220209511432334`),
            USER_ID = message.author.id
            USER = guild.member(USER_ID)
        if (!guild.member(USER_ID)) return console.log(`User who DM'd bot isn't in the Infado server`)
        const member = client.users.resolve(USER)

        if (message.author.bot) return

        let chan = guild.channels.cache.find(c => c.name === USER_ID)

        //init User message Embed for multiple uses
        const userEmbed = new Discord.MessageEmbed()
        .setColor('#6A0DAD')
        //.setTitle(`User Message`)
        //.setAuthor(`${USER}, ID: ${USER_ID}`)
        .setDescription(`${USER}, ID: ${USER_ID}`)
        .setThumbnail(member.avatarURL())
        .addField(`User Message`, message)
        .setTimestamp()
        

        // Channel exists check
        if (chan) {
            // send message to open ticket
            if (message.author.id === chan.name) {
                await chan.send(userEmbed)
                .catch(err => console.log('There was a error with sending message to an open ticket in modmail', err))
            }
            return
        } else {
            //creates the channel with userid as the name
            const ticket = await guild.channels.create(USER_ID, {
                type: 'text', 
                parent: "747457097762865203" // id of ticket channel category
            })
            .catch(err => console.log("There was an error with making channel for modmail", err))

            //sends first messages to channel
            //TODO REFACTOR add modmail feature to module 
            // TODO create a small embed for user messages
            // BUG antispam won't listen to bot messages => modmail spam will be an issue

            const channel = client.channels.cache.get(ticket.id)
           

            //User DM with Modmail message
            try {
                const modmailEmbed = new Discord.MessageEmbed()
                //TODO Change color and create .setThumbnail for bot pfp
                    .setColor('#6A0DAD')
                    .setTitle(`Welcome to Modmail`)
                    .setDescription(`We have sent your message to staff, expect a reply shortly. \nYou may continue to explain your issue here if needed.`)
                    //.setThumbnail(member.avatarURL())
                    .setFooter("Note: Misuse of Modmail may lead to punishment.")
                    .setTimestamp()
                    await member.send(modmailEmbed);
            } catch (e) {
                console.log("Modmail: Error sending initial DM embed", e)
            }
            
            // New embed with User Log Data
            try {
                    // arg will be name or id of user 
                    const tagList = await punishmentLog.findAll({ where: { userid: USER_ID } });
                    //let username = await punishmentLog.findOne({ where: {userid: USER_ID}});

                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#6A0DAD')
                    .setTitle(`Staff Log`)
                    .setDescription(`User history for ${member}, ID: ${member.id}`)
                    .setThumbnail(member.avatarURL())
                    if (tagList.length > 0){
                        tagList.forEach(t => {
                        exampleEmbed.addFields(
                            { name: `Log ID\: ${t.id} \| ${t.punishment} for ${t.reason}`, value: `Done by Staff: ${t.staffName}`}
                        )})
                    } else if (tagList.length === 0) {
                        exampleEmbed.addField('Userlog', `This user has no punishment history`)
                    } else {
                        console.log(`error with userlog function: tagList`)
                    }
                    await channel.send(exampleEmbed);
            } catch (e) {
                console.log(`There was an issue with the userlog Modmail function`, e);
            }
            await channel.send(userEmbed)
            .catch(err => console.log("There was an error sending messages after creating channel in modmail", err))
            return
        }

    } else if (!command) { //INIT REACT FOR CONTENT VOTING
        /*if (message.channel.id === contentVoteChannel){
            await message.react('👍')
        } else {
            return;
        }*/
    } else if (message.content.startsWith(prefix) && command.guildOnly && message.channel.type !== 'text') {
        return;
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

    let now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;


    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }getRoles
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, message, args, punishmentLog, rolesChannel, strengthsObj);
    } catch (error) {
        console.error(error);
        message.reply(`Couldn't execute that command because of \`${error}\``);
    }

    // logs punishment if log is true in module
    //TODO add this to a modulegetRoles
    if (command.log) {
        try {
            async function f(client, message, args, punishmentLog) {
                const user = message.mentions.members.first() || client.users.resolve(args[0])
                const member = await message.guild.members.cache.find(m => m.id === user.id)

                let reason = args.slice(1).join(' ');
                if (!reason) reason = 'No reason provided';

                const log = await punishmentLog.create({
                    userid: member.id,
                    username: `${member}`,        
                    punishment: command.name,
                    reason: reason,
                    staffName: `<@${message.author.id}>`,
                });
                // sends to channel in MOOC server for staff log
                const channel = client.channels.cache.get(staffLogChannel)
                if (channel) {
                    let staffActionLogEmbed = new Discord.MessageEmbed()
                    .setColor("PURPLE")
                    .setAuthor(`Staff Action Log`)
                    .setDescription(`Done by Staff ${log.staffName} to User: ${log.username} \`${log.userid}\``)
                    .addField(`Action: ${log.punishment}`, `Reason: ${log.reason}`)
                    .setFooter(`User Log ID: ${log.id}`)
                    channel.send(staffActionLogEmbed)
                }
                return message.reply(`Log ${log.username} added.`);
                
            }
            f(client, message, args, punishmentLog)
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
    
    // only listen for reactions in channels we want to handle reactions
    if (!reaction.message.channel.id === (lfgVoteChannel || contentVoteChannel || rolesChannel || rulesChannel)) return;
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
    
    let guildId = reaction.message.guild.id;
    // ignore other servers until i set them up
    if (guildId !== `731220209511432334`) return
    let member = reaction.message.guild.members.cache.find(u => u.user === user);

    //ignore reaction listener if it is from a bot
    if (member.bot) return
    
    
    
    // RULES FUNCTION
    if (reaction.message.id === rulesMessageID && reaction.emoji.name === '📚'); {
        // Find role Pupil and add it to the user
        let role = reaction.message.guild.roles.cache.find(role => role.name === 'Pupil');
        member.roles.add(role);
    }

    // ROLES ADD FUNCTION
    //Strengths Role Add Function
    if (reaction.message.id === strengthsMessageID) {
        //collection of reactions that user is in
        const userReactions = reaction.message.reactions.cache.filter(reaction => reaction.users.cache.has(member.id));
        const userReactionsArr = userReactions.keyArray();
        const firstReact = userReactions.last();

        //console logs if firstReact is undefined (bug)
        //BUG if the user reacts after bot restart it will not give correct role => reaction returns undefined
        //BUG If user reacts WITH REACTION after bot restart it not give correct role
        //TODO list user strengths roles, if has role remove all reacts and roles except one if the reaction is a role the user has

        //Strengths Roles exist check

            /*const roleCheck = member.roles.cache.filter(role => role.name === strengthsObj[reaction.emoji.name])
            if (!roleCheck || (reaction === roleCheck.last())) return
            console.log(`Comparing value: ${value} to roleCheck: ${roleCheck}`)
            await member.roles.remove(roleCheck)*/
        


        if (firstReact == undefined){
            console.log(`Member id ${member.id} tried to select a Strength, may open ticket`)
            return
        //Adds Strengths Role if first
        } else if (firstReact && (firstReact.emoji.name === reaction.emoji.name)){
            const strengthsRole = reaction.message.guild.roles.cache.find(r => r.name === strengthsObj[firstReact.emoji.name])
            await member.roles.add(strengthsRole)
            return
        //Removes react if already selected a role
        } else if (firstReact && (userReactionsArr.length > 1)) {
            for (const reaction of userReactions.values()) {
                if (reaction.emoji.name === firstReact.emoji.name) return
                await reaction.users.remove(member.id);
            }
            return
        }
        return

    }

    //INTERESTS ROLE ADD FUNCTION
    if (reaction.message.id === interestsMessageID){

        //TODO if user has a strengthRole and applies an interestRole returns (vise versa)
        const interestsRole = reaction.message.guild.roles.cache.find(r => r.name === interestsObj[reaction.emoji.name])
        await member.roles.add(interestsRole)
        return

    }

    // TODO Add Vote Add Function
    // VOTE ADD FUNCTION

    //LFG Vote Function
    if (reaction.message.channel.id === lfgVoteChannel){

        
        
        //Changes lfgCount relative to how many channels exist
        const getLfgHub = client.channels.cache.filter(c => c.parentID === lfgHubParentID)
        let arr = getLfgHub.keyArray()
        console.log(`arr length is ${arr.length}`)
        let lfgCount = 3
        if (arr.length > 1) {
            lfgCount = arr.length * 10
        }
        console.log(`lfg count is ${lfgCount}`)
        //finds only the channels that are over lfg count
        let reactionCount = reaction.message.reactions.cache.find(reaction => reaction.count >= lfgCount)
        if (!reactionCount) return // ignores reacts that aren't greater or equal to the first lfgCount
        await reaction.message.channel.messages.fetch() //fetches the messages from cache

        // this gets the description for channel finding/making usage
        const category = reaction.message.embeds[0]
        const categoryName = category.fields[0].value.replace(/\s+/g, '-').toLowerCase()
        
        const getContentHub = client.channels.cache.filter(c => c.parentID === contentHubParentID)
        
        const findCategoryContent = client.channels.cache.find(c => c.name === categoryName)
        const findCategoryLfg = client.channels.cache.find(c => c.name === categoryName)


        //check if message.content / channel.name exist in both contentHub or lfgHub
        if (findCategoryContent && findCategoryLfg) {
            return console.log(`LfgVote: Channel ${category.fields[0].value} already exists`)
        } else {
            let guild = client.guilds.cache.get(guildID)
            //creates channel in both Lfg-hub and Content-hub
            //LFG-Hub
            const lfgChannelCreate = await guild.channels.create(category.fields[0].value, {
                type: 'text', 
                parent: lfgHubParentID // id of lfg-hub channel category
            })
            .catch(err => console.log("There was an error with making channel for LfgVote", err))
            //Content-Hub
            const contentChannelCreate = await guild.channels.create(category.fields[0].value, {
                type: 'text', 
                parent: contentHubParentID // id of lfg-hub channel category
            })
            .catch(err => console.log("There was an error with making channel for ContentVote", err))
        }
    }


    //CONTENT VOTING
    /*if (reaction.channel.id === contentVoteChannel) {
        let contentCount = 3 //number of votes for content to be posted
        if (guild.memberCount > 50) {
            contentCount = (guild.memberCount / 10)
        }
        let reactionCount = reaction.message.cache.find(reaction => reaction.count >= contentCount)
        if (!reactionCount) return;
    }*/

    
}); 

client.on('messageReactionRemove', async (reaction, user) => {

    // only listen for reactions in channels we want to handle reactions
    if (!reaction.message.channel.id === (lfgVoteChannel || contentVoteChannel || rolesChannel || rulesChannel)) return;
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
    
    let guildId = reaction.message.guild.id;
    // ignore other servers until i set them up
    if (guildId !== `731220209511432334`) return
    let member = reaction.message.guild.members.cache.find(u => u.user === user);
    
    // Roles Removal Function

    //Strengths Role
    if (reaction.message.id === strengthsMessageID) {
        const strengthsRole = reaction.message.guild.roles.cache.find(r => r.name === strengthsObj[reaction.emoji.name])
        await member.roles.remove(strengthsRole)
    }
    //Interests Role
    if (reaction.message.id === interestsMessageID){

        //TODO if user has a strengthRole and applies an interestRole returns (vise versa)
        const interestsRole = reaction.message.guild.roles.cache.find(r => r.name === interestsObj[reaction.emoji.name])
        await member.roles.remove(interestsRole)
        return

    }

    // TODO Add Vote Removal Function
    // Vote Removal Function

    
}); 


// Client message delete logger

client.on('messageDelete', async message => {

    if (!message.guild) return;

    if (message.partial) {
		// try catch for fetching
		try {
			await message.fetch();
		} catch (error) {
            if (error = 'DiscordAPIError: Unknown Message') {return console.log("User deleted a message prior to bot update, wont log");
            } else { return console.log('Something went wrong when fetching the message: ', error)};
		}
    }

    let guildId = message.guild.id;
    // ignore logs from other servers until i set them up
    if (guildId !== guildID) return

    try {
        await message.channel.messages.cache.find(m => m.id === message.id)
    } catch (error) {
        console.log(`Something went wrong when trying to fetch message from cache in messageDelete`, error);
    }
    
    const deleteChannel = client.channels.cache.get(staffLogChannel)
    const member = message.guild.members.cache.find(u => u.user === message.author);

    try {
        if (!member) return;
        if (member.bot) return;
        if ((message.content || message.author) === undefined) return console.log(`Probably tried to delete a message before bot restart, won't log`)
    } catch (error) {
        return console.log(`There was an error in conditions of messageDelete`, error);
    }
    try {
        const deleteEmbed = new Discord.MessageEmbed()
        .setColor('BLUE')
        //TODO Add Garbage Can Icon to Author deleteEmbed
        .setAuthor(`User Delete A Message`)
        .setDescription(`ID: ${message.id} | In: ${message.channel}\nUser: ${message.author} \`${message.author.tag} , ${message.author.id}\``)
        .addField(`_ _`, `Message Content: \`${message.content}\``)
        deleteChannel.send(deleteEmbed);
    } catch (error) {
        return console.log(`There was an error sending a message to deleteChannel in staffLog`, error);
    }
	
});

// Client message edit logger

client.on('messageUpdate', async (oldMessage, newMessage) => {

    const editChannel = client.channels.cache.get(staffLogChannel)
    const rules = '735537345981579457'
    const getRoles = '744536926757060683'
    

    
    // TODO add staff chats to the list of ignored channels
    if (newMessage.channel.id === (rules || getRoles)) return
    //if (!oldMessage.guild.id === '731220209511432334') return;
    if (!oldMessage.guild || !newMessage.guild) return;
    

    if (oldMessage.partial) {
		// try catch for fetching
		try {
			await oldMessage.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
    }

    try {
        await oldMessage.channel.messages.cache.find(m => m.id === oldMessage.id)
    } catch (error) {
        console.log('Something went wrong with fetching the message id', error)
    }

    if (oldMessage.content === undefined) return console.log('oldMessage is returning undefined, probably edited a message before bot was restarted. May not log')
    

    if (newMessage.partial) {
		// try catch for fetching
		try {
			await newMessage.fetch();
		} catch (error) {
			console.log('Something went wrong when fetching the message: ', error);
			return;
		}
    }

    try {
        if (newMessage.author.bot || oldMessage.author.bot) return
    } catch (error) {
        console.log(`Message Edit Listener Error: Checking if message editor is a bot returned an error, \n ${error}`)
    }
    

    let guildId = newMessage.guild.id;
    // ignore logs from other servers until i set them up
    if (guildId !== guildID) return
    
    const user = oldMessage.guild.members.cache.find(u => u.user === newMessage.author)

    try {
        if (user.bot) return;
    } catch (error) {
        console.log(`Message Edit Listener Error: checking if user is bot returned an error, \n ${error}`)
    }
   

    const editEmbed = new Discord.MessageEmbed()
    .setColor('YELLOW')
    .setAuthor('User Edited a Message')
    .setDescription(`Message ID: ${newMessage.id} in ${newMessage.channel} \nUser: ${newMessage.author} \`${newMessage.author.tag}, ${newMessage.author.id}\``)
    .addFields({name: `Old Message:`, value: `${oldMessage.content}`},{name: `New Message`, value: `${newMessage.content}`})

    editChannel.send(editEmbed)

});

client.on("guildMemberAdd", member => {
    const staffLog = client.channels.cache.get(staffLogChannel)
    let dateJoined = ms(member.user.createdTimestamp)
    const memberAddEmbed = new Discord.MessageEmbed()
    .setColor(`GREEN`)
    //TODO add green check to author
    .setAuthor(`User Joined The Server`)
    .setDescription(`User: ${member} | \`${member.user.tag}, ${member.id}\` `)
    .addField(`User Joined Discord:`, `${dateJoined}`)
    staffLog.send(memberAddEmbed)
});

client.on("guildMemberRemove", member => {
    const staffLog = client.channels.cache.get(staffLogChannel)
    const timeLeft = ms(Date.now() - member.joinedAt)
    const memberRemoveEmbed = new Discord.MessageEmbed()
    .setColor(`RED`)
    .setAuthor(`User Left The Server`)
    .setDescription(`User: ${member} | \`${member.user.tag}, ${member.id}\` `)
    .addField(`User Left The Server After:`, `${timeLeft}`)
    staffLog.send(memberRemoveEmbed)
});

//HEROKU LIVE?
//client.login(process.env.BOT_TOKEN);

//LOCAL TESTING
client.login(token)