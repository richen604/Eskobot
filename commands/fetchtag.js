module.exports = {
    name: 'fetchtag',
    description: 'fetches a database log',
    guildOnly: 'true',
    args: 'true',
    usage: '*Testing* | <username> |',
    staffRoles: ['Exec.Director', '+'],
    execute (client, message, args, punishmentLog) {
        async function f() {
            const tagName = args[0];

            // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
            const tag = await punishmentLog.findOne({ where: { username: tagName } });
            if (tag) {
                // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
                tag.increment('count');
                return message.channel.send(tag.get('punishment'));
            }
            return message.reply(`Could not find tag: ${tagName}`);
        }
        f()
    }
}