const Discord = require('discord.js');

module.exports = {
    name: "userlog",
    description: "shows user history",
    args: 'true',
    usage: '<username> | <userid>',
    guildOnly: "true",
    staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy', ".", "+", "Mascot"],
    execute(client, message, args, punishmentLog) {
        try {
            async function f() {
                // arg will be name or id of user 
                const member = message.mentions.users.first() || client.users.resolve(args[0]);
                if (!member) { return message.reply('Please mention a valid member of this server'); }
                const tagList = await punishmentLog.findAll({ where: { userid: member.id } })
                
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#6A0DAD')
                .setTitle(`Staff Log`)
                .setDescription(`User history for ${member}, ID: ${member.id}`)
                .setThumbnail(member.avatarURL())
                if (tagList.length > 0){
                    tagList.forEach(t => {
                    exampleEmbed.addFields(
                        { name: `id\: ${t.id} \| ${t.punishment} for ${t.reason}`, value: `Done by Staff: ${t.staffName}`}
                    )})
                } else {
                    exampleEmbed.addField(`Userlog`,`This user has no punishment history`)
                }
                await message.channel.send(exampleEmbed);
                return
            }f()
        } catch (e) {
            return console.log(`There was an issue with the !userlog command`, e);
        }
    
    }
}