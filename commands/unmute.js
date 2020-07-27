module.exports = {
    name: 'unmute',
    description: 'Removes muted role from user',
    guildOnly: 'true',
    execute(client, message, args) {
        if (!message.member.roles.cache.some(r => ['Exec. Director', 'Board Member', 'Staff', 'Comfy'].includes(r.name))) { return message.reply('Sorry, you don\'t have permissions to use this!'); }

        const member = message.mentions.members.first() || client.users.resolve(args[0]);
        if (!member) { return message.reply('Please mention a valid member of this server'); }

        const muterole = message.guild.roles.cache.find(r => r.name === 'Muted');

        member.roles.remove(muterole.id);
        message.channel.send(`${member} now has been unmuted`);

    },
};