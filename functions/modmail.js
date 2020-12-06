const Discord = require('discord.js');

const userEmbedFunc = async function(messageUser, message) {
    const userEmbed = new Discord.MessageEmbed()
        .setColor('#6A0DAD')
        .setDescription(`${messageUser}, ID: ${messageUser.id}`)
        .setThumbnail(messageUser.avatarURL())
        .addField('User Message', message)
        .setTimestamp();
    return userEmbed;
};

const ChannelMessageHandler = async function(client, message, guild, messageUser, punishmentLog) {

    //check for ticket parent channel and ticket existing user ticket channel
    //TODO add uuid's for a ticket id, allow for multiple tickets per user
    const currentGuildConfig = await client.guildConfigs.get(guild.id);
    if(!currentGuildConfig.ticketParentId) return message.reply(`${guild.name} has not set up init for Modmail, missing a channel category for tickets`);
    const UserTicketChannel = guild.channels.cache.find(channel => channel.name.includes(messageUser.id) == true);

    //init User message Embed for multiple uses
    const userEmbed = await userEmbedFunc(messageUser, message);

    // Channel exists check
    if (UserTicketChannel) {
        // send message to open ticket
        await UserTicketChannel.send(userEmbed)
        .catch(err => console.log('There was a error with sending message to an open ticket in modmail', err));
        return;
    }
 else {
        //creates the channel with userid as the name
        const ticket = await guild.channels.create(`${messageUser.tag} ${messageUser.id}`, {
            type: 'text', 
            parent: currentGuildConfig.ticketParentId, // id of ticket channel category //TODO ticket parent id in bot init function
        })
        .catch(err => console.log('There was an error with making channel for modmail', err));

        //sends first messages to channel
        // BUG antispam won't listen to bot messages => modmail spam will be an issue

        const channel = client.channels.cache.get(ticket.id);
        

        //User DM with Modmail message
        try {
            const modmailEmbed = new Discord.MessageEmbed()
            //TODO Change color and create .setThumbnail for bot pfp
                .setColor('#6A0DAD')
                .setTitle('Welcome to Modmail')
                .setDescription('We have sent your message to staff, expect a reply shortly. \nYou may continue to explain your issue here if needed.')
                //.setThumbnail(member.avatarURL())
                .setFooter('Note: Misuse of Modmail may lead to punishment.')
                .setTimestamp();
                await messageUser.send(modmailEmbed);
        }
 catch (e) {
            console.log('Modmail: Error sending initial DM embed', e);
        }
        
        // New embed with User Log Data
        try {
                // arg will be name or id of user 
                const tagList = await punishmentLog.findAll({ where: { userid: messageUser.id } });

                const userlogEmbed = new Discord.MessageEmbed()
                .setColor('#6A0DAD')
                .setTitle('Staff Log')
                .setDescription(`User history for ${messageUser}, ID: ${messageUser.id}`)
                .setThumbnail(messageUser.avatarURL());
                if (tagList.length > 0) {
                    tagList.forEach(t => {
                    userlogEmbed.addFields(
                        { name: `Log ID: ${t.id} | ${t.punishment} for ${t.reason}`, value: `Done by Staff: ${t.staffName}` },
                    );
});
                }
 else if (tagList.length === 0) {
                    userlogEmbed.addField('Userlog', 'This user has no punishment history');
                }
 else {
                    console.log('error with userlog function: tagList');
                }
                await channel.send(userlogEmbed);
        }
 catch (e) {
            console.log('There was an issue with the userlog Modmail function', e);
        }
        await channel.send(userEmbed)
        .catch(err => console.log('There was an error sending messages after creating channel in modmail', err));
    }
};

const ModmailGuildPrompt = async function(message, messageUser, memberGuildsArr) {

    //TODO should probably add a cooldown feature for the function to prevent spamming the bot
    //Create an array of objects with numerical emoji keys to relate to each guild
    const reactionArr = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];
    const memberGuildsArrReacts = [];
    memberGuildsArr.forEach(function(item, index) {
        const newGuildObj = {
            'guild': item,
            'reaction': reactionArr[index],
        };
        return memberGuildsArrReacts.push(newGuildObj);
    });

    //Create an Embed to be used for prompt
    const GuildPromptEmbed = new Discord.MessageEmbed() 
        //TODO Change color and create .setThumbnail for bot pfp
        .setColor('#6A0DAD')
        .setTitle(`Welcome to Modmail ${messageUser.username}`)
        .setDescription('Before you begin, please select the server you are directing your message to.')
        //.setThumbnail(member.avatarURL())
        .setFooter('Note: Misuse of Modmail may lead to punishment.')
        .setTimestamp();
        memberGuildsArrReacts.forEach(function(item) {
            GuildPromptEmbed.addFields({
                name: `${item.reaction} `, value: `${item.guild.name}`, inline: true,
            });
        });

    //Send message and react with correct amount of emotes
    const embedMessage = await message.channel.send(GuildPromptEmbed);
    memberGuildsArrReacts.forEach(async function(item) {
            await embedMessage.react(item.reaction);
    });

    //creates a listener for reactions
    const filter = (reaction, user) => {
        return reactionArr.includes(reaction.emoji.name) && user.id === messageUser.id;
    };
    const selectedGuild = await embedMessage.awaitReactions(filter, { time: 5000, errors: ['time'] })
	.catch(collected => {

        //Grab selected server to return to bot
        const reaction = collected.firstKey();

        //if undefined means the user didnt react, send a message to user if the user has not reacted
        if(!reaction) {
            message.channel.send(`${messageUser.username}, you have timed out selecting a server. To try again please message here`);
            return false;
        }
        const { guild } = memberGuildsArrReacts.find(obj => obj.reaction === reaction);
        return guild;
    });

    return selectedGuild;
        
};

module.exports = { 
    ModmailGuildPrompt,
    ChannelMessageHandler,
};