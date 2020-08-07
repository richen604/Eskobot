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
    
            const tagList = await punishmentLog.findAll({ where: { username: name } } || {where: { userid: name}});
            let username = await punishmentLog.findOne({ where: {username: name}});
            if (username){
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`User history for ${username.username}`)
                .setAuthor('Staff Log', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
                .setDescription('Some description here')
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                tagList.forEach(t => {
                    exampleEmbed.addFields(
                        { name: `${t.punishment} for ${t.reason}`, value: `Done by Staff: ${t.staffName}`}
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