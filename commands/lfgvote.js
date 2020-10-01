const Discord = require("discord.js")

module.exports = {
    name: 'lfgvote',
    description: "takes an array of categories, embeds it to the lfgVote channel",
    guildOnly: 'true',
    staffRoles: ['Exec. Director', "."],
    execute(client,message,args,punishmentLog) {
        if (message.channel.id !== `735951916621627472`) return message.reply('This command is limited to the lfgVote channel')
        if ((typeof args !== 'array') && (typeof args[0] !== 'undefined')) { return message.reply('Please provide an array of categories')};
        
        const links = ["Art and Design 🧩","Business 👔", "Computer Science 💻", "Data Science 🖥️", "Engineering 🦺", "Education & Teaching 📌",
        "Health & Medicine 💉", "Humanities 🔎","Programming ⌨️","Personal Development 🗿","Mathematics 📐","Sciences 🔬",
        "Social Sciences 💡"] //change to array here for easy posting, format [Category, Category.....)


        try {
            for (const item of links){

                const lfgVoteEmbed = new Discord.MessageEmbed()
                .setDescription(`**React to this message to create the Lfg / Content Channel!**`)
                .addFields( {
                    name: `_ _`, value: `${item}`, inline: false
                })
                 
                async function f() {
                    await message.channel.send(lfgVoteEmbed).then(embed => {embed.react('👍')})
                }f()
            
            }
        } catch (error) {
            console.log(`!populateLfg: There was an error posting links to lfgVote channel`)
        }

        
    }
}