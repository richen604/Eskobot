module.exports = {
    name: 'unmute',
    description: 'Removes muted role from user',
    guildOnly: 'true',
    staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy'],
    execute(client, message, args) {
        const member = message.mentions.members.first() || client.users.resolve(args[0]);
        if (!member) { return message.reply('Please mention a valid member of this server'); }

        const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');

        member.roles.remove(muterole.id);
        message.channel.send(`${member} now has been unmuted`);

    },
};