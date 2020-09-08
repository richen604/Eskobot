const Discord = require('discord.js');

module.exports = {
    name: 'interests',
    description: 'posts an embed for interests roles, Admin Only',
    staffRoles: ["Exec. Director"],
    guildOnly: "true",
    execute(client, message, args, punishmentLog, rolesChannel, interestsObj) {
        if (message.channel.id !== rolesChannel) return
        message.delete().catch(O_o => {});
        const interestsEmbed = new Discord.MessageEmbed()
        .setDescription(`---------------------**React to this message for an Interests Role!**--------------------- \nLimited to 1 role, if the correct role isn't showing remove all reactions and select again.`)
        for (const key in interestsObj) {
            interestsEmbed.addFields( {
                name: `_ _`, value: `${interestsObj[key]}`, inline: true
            })
        }
        async function f() {
        const msg = await message.channel.send(interestsEmbed)
        for (const key in interestsObj) {
                msg.react(key)
        }
        console.log(`set interestsMessageID in config.js to: ${msg.id}`)
        }
        f()
        
        return
    }
}