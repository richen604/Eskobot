const Discord = require('discord.js');

module.exports = {
    name: "userlog",
    description: "shows user history",
    args: 'true',
    usage: '<username> | <userid>',
    guildOnly: "true",
    staffRoles: ['Exec.Director', '+'],
    execute(client, message, args, punishmentLog) {
        try {
            async function f() {
                // arg will be name or id of user 
                const name = args[0];
                const member = message.mentions.users.first() || client.users.resolve(args[0]);
                if (!member) { return message.reply('Please mention a valid member of this server'); }
                const tagList = await punishmentLog.findAll({ where: { username: name } } || {where: { userid: name}});
                let username = await punishmentLog.findOne({ where: {username: name}});
                if (username){
                    const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('#6A0DAD')
                    .setTitle(`Staff Log`)
                    .setDescription(`User history for ${member}`)
                    .setThumbnail(member.avatarURL())
                    tagList.forEach(t => {
                        exampleEmbed.addFields(
                            { name: `id\: ${t.id} \| ${t.punishment} for ${t.reason}`, value: `Done by Staff: ${t.staffName}`}
                        )
                    })
                    return message.channel.send(exampleEmbed);
            } else { message.reply('User not found')}
            }f()
        } catch (e) {
            return console.log(e);
        }
        
        // TODO: Change username arg to ping => requires changes in addtag.js
        // TODO: Make Embed better looking 
    }
}