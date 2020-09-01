const Discord = require('discord.js');
const {strengthsMessageID} = require('../config.json')

module.exports = {
    name: 'strengths',
    description: 'posts an embed for strengths roles, Admin Only',
    staffRoles: ["Exec. Director"],
    guildOnly: "true",
    execute(client, message, args, punishmentLog, rolesChannel, strengthsObj) {
        if (message.channel.id !== rolesChannel) return
        message.delete().catch(O_o => {});
        const strengthsEmbed = new Discord.MessageEmbed()
        .setDescription(`React to this message for Strengths Roles!`)
        for (const key in strengthsObj) {
            strengthsEmbed.addFields( {
                name: `${key}`, value: `${strengthsObj[key]}`, inline: true
            })
        }
        async function f() {
        const msg = await message.channel.send(strengthsEmbed)
        for (const key in strengthsObj) {
                msg.react(key)
        }
        console.log(`set strengthsMessageID in config.js to: ${msg.id}`)
        }
        f()
        
        return
    }
}