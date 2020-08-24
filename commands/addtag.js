
module.exports = {
    name: 'addtag',
    description: 'adds a tag to the database (testing)',
    guildOnly: 'true',
    args: 'true',
    usage: '*Testing* | <time> <reason> |',
    staffRoles: ['Exec. Director', '+',`.`],
    execute(client, message, args, punishmentLog) {
        try {
            async function f() {
                const log = await punishmentLog.create({
                    userid: message.author.id,
                    username: message.author.username,
                    punishment: args.join(' '),
                    reason: null,
                    staffName: message.author.id,
                });
                return message.reply(`Log ${log.username} added.`);
            }
            f()
        }
        catch (e) {
            if (e.name === 'SequelizeUniqueConstraintError') {
                return message.reply('That log already exists.');
            }
            console.log(e)
             return message.reply("Something went wrong with adding a log.");
        }
    }
}