module.exports = {
    name: 'kick',
    aliases: ['boot'],
    description: 'Boots a user out of the server',
    guildOnly: 'true',
    execute(client, message, args) {
        // check for roles
        if (!message.member.roles.cache.some(r => ['Exec. Director', 'Board Member', 'Staff', 'Comfy'].includes(r.name))) { return message.reply('Sorry, you don\'t have permissions to use this!'); }

        // user mention check
        const member = message.mentions.members.first() || client.users.resolve(args[0]);
        if (!member) { return message.reply('Please mention a valid member of this server'); }
        if (!member.kickable) { return message.reply('I cannot kick this user! Do they have a higher role? Do I have kick permissions?'); }

        // reason join function / check
        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided';

        member.kick(reason).catch(err => {
            console.log(err);
            message.reply(`Sorry ${message.author} I couldn't kick because of : ${err}`);
        });
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    },
};