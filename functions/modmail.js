const Discord = require('discord.js');

const ModmailGuildPrompt = async function(message, messageUser, memberGuildsArr) {
    //Create an array of objects with numerical emoji keys to relate to each guild
    const reactionArr = ['1⃣', '2⃣', '3⃣', '4⃣', '5⃣', '6⃣', '7⃣', '8⃣', '9⃣', '🔟'];
    const memberGuildsArrReacts = [];
    memberGuildsArr .forEach(function(item, index) {
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
        memberGuildsArrReacts.forEach(function(item, index) {
            GuildPromptEmbed.addFields({
                name: `${item.reaction} `, value: `${item.guild.name}`, inline: true,
            });
        });

    //Send message and react with correct amount of emotes
    const embedMessage = await message.channel.send(GuildPromptEmbed);
    memberGuildsArrReacts.forEach(async function(item) {
            await embedMessage.react(item.reaction);
    });

    //define selectedGuild above scope
    let selectedGuild = null;

    //creates a listener for reactions
    const filter = (reaction, user) => {
        return reactionArr.includes(reaction.emoji.name) && user.id === messageUser.id;
    };
    embedMessage.awaitReactions(filter, { time: 10000, errors: ['time'] })
	.catch(collected => {

        //Grab selected server to return to bot
        const reaction = collected.firstKey();

        //if undefined means the user didnt react, send a message to user if the user has not reacted
        if(!reaction) {
            message.channel.send(`${messageUser.username}, you have timed out selecting a server. To try again please message here`);
            return;
        }
        const { guild } = memberGuildsArrReacts.find(obj => obj.reaction === reaction);
        selectedGuild = guild;
    });

    return selectedGuild;
        
};

exports.ModmailGuildPrompt = ModmailGuildPrompt;