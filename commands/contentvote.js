module.exports = {
    name: 'contentvote',
    description: "takes an object, gets key/value pairs, embeds it to the contentVote channel",
    guildOnly: 'true',
    staffRoles: ['Exec. Director', "."],
    execute(client,message,args,punishmentLog) {
        if (message.channel.id !== `735951123898302614`) return message.reply('This command is limited to the contentVote channel')
        if ((typeof args !== 'object') && (typeof args[0] !== 'undefined')) { return message.reply('Please provide an object of links')};
        
        const links = {"key": "value", "test": "test"} //change to object here for easy posting, format [key: Category, value: link]

        const keyValue = Object.entries(links)
        if (keyValue === undefined) return console.log('!populate: Args was not an iterable object')

        try {
            for (const arr of keyValue){
                async function f() {
                    await message.channel.send(arr.join(`\n _ _ \n`)).then(msg => {msg.react('👍')})
                }f()
            
            }
        } catch (error) {
            console.log(`!populate: There was an error posting keyValue to channel`)
        }

        
    }
}