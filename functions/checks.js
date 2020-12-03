const Discord = require('discord.js');

// checks if feature is true in the guilds config file
// if false returns a message reply that the feature is turned off by staff
const featureConfigCheck = function(client, message, feature, currentGuildConfig) {

    
    //Gets the guild from the currentGuildConfig
    const guild = client.guilds.cache.get(currentGuildConfig.guild);

    if(!currentGuildConfig) return message.reply(`${guild.name} has not set up ${feature} yet`);

    console.log(currentGuildConfig);
    
    //const thisFeature = currentGuildConfig.find();
    //console.log(thisFeature);

    //BUG replies could lead to Bot DM spam
    //TODO create a Settimeout function that returns outside of this check to prevent spamming
    
    //if(currentGuildConfig.feature === false) return message.reply(`${guild.name} has chose not to have ${feature}`);
};

module.exports = {
    featureConfigCheck,
}