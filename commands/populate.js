module.exports = {
    name: 'populate',
    description: "takes an array of links and embeds it to the channel",
    args: 'true',
    guildOnly: 'true',
    staffRoles: ['Exec. Director', '+', "."],
    execute(client,message,args,punishmentLog) {
        if (!typeof args === 'array') { return message.reply('Please provide an array of links')};
        
        const links = args[0]

        try {
            links.forEach( l => { 
                message.channel.send(t);
            })
        } catch (error) {
            
        }

        
    }
}