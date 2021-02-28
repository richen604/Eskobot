module.exports = {
    name: 'ban',
    description: 'Bans the user from this server',
    guildOnly: 'true',
    staffRoles: ['Exec. Director', 'Board Member', 'Staff', '.', '+'],
    log: 'true',
    args: 'true',
    async execute(client, message, args) {
        const user =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0]) ||
            (await message.guild.members.fetch(args[0]));
        if (!user) {
            return message.reply(
                'Please mention a valid member of this server',
            );
        }
        if (!user.bannable) {
            return message.reply(
                'I cannot ban this user! Do they have a higher role? Do I have ban permissions?',
            );
        }
        const member = message.guild.members.cache.find(
            (m) => m.id === user.id,
        );

        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided';

        member.ban({ days: 7, reason: `${reason}` }).catch((err) => {
            console.log(err);
            message.reply(
                `Sorry ${message.author} I couldn't ban because of : ${err}`,
            );
        });
        message.reply(
            `${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`,
        );
    },
};
