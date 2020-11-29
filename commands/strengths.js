const Discord = require('discord.js');
const { rolesChannel, strengthsObj } = require('../config.json');

module.exports = {
    name: 'strengths',
    description: 'posts an embed for strengths roles, Admin Only',
    staffRoles: ['Exec. Director'],
    guildOnly: 'true',
    execute(client, message) {
        if (message.channel.id !== rolesChannel) return;
        message.delete().catch(err => console.log(err));
        const strengthsEmbed = new Discord.MessageEmbed()
        .setDescription('---------------------**React to this message for a Strengths Role!**--------------------- \nLimited to 1 role, if the correct role isn\'t showing remove all reactions and select again.');
        for (const key in strengthsObj) {
            strengthsEmbed.addFields({
                name: '_ _', value: `${strengthsObj[key]}`, inline: true,
            });
        }
        async function f() {
        const msg = await message.channel.send(strengthsEmbed);
        for (const key in strengthsObj) {
                msg.react(key);
        }
        console.log(`set strengthsMessageID in config.js to: ${msg.id}`);
        }
        f();
        
        return;
    },
};