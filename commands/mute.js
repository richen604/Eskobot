const ms = require('ms');

module.exports = {
    name: 'mute',
    description: 'Mutes the user for a specific time',
    args: 'true',
    usage: ': | <null> | <time> <reason> | <time>',
    guildOnly: 'true',
    staffRoles: ['Exec.Director', 'Board Member', 'Staff', 'Comfy'],
    execute(client, message, args) {
        const member = message.mentions.members.first() || client.users.resolve(args[0]);
        if (!member) { return message.reply('Please mention a valid member of this server'); }

        const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');

        let reason = args.slice(2).join(' ');
        if (!reason) reason = 'No reason provided';

        const time = args[1];

        if (!time) {
            member.roles.add(muterole.id);
            message.channel.send(`${member} has now been muted for ${reason}`);
            return;
        }

        member.roles.add(muterole.id);
        message.channel.send(`${member} has now been muted for ${ms(ms(time))} for ${reason}`);

        setTimeout(function() {
            member.roles.remove(muterole.id);
            message.channel.send(`${member} now has been unmuted`);
        }, ms(time));

    },
};