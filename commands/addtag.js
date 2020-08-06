
module.exports = {
    name: 'addtag',
    description: 'adds a tag to the database (testing)',
    guildOnly: 'true',
    args: 'true',
    usage: '*Testing* | <time> <reason> |',
    staffRoles: ['Exec.Director', '+'],
    execute(client, message, args, Tags) {
        try {
            async function f() {
                const tag = await Tags.create({
                    userid: message.author.id,
                    username: message.author.username,
                    punishment: args.toString(),
                        
                });
                return message.reply(`Tag ${tag.username} added.`);
            }
            f()
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That tag already exists.');
            }
            console.log(e)
             return message.reply("Something went wrong with adding a tag.");
        }
    }
}