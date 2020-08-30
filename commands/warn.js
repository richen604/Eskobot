module.exports = {
    name: "warn",
    description: 'warns the player, giving a reason for the warning',
    usage: '!warn <reason>',
    staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy', "."],
    log: 'true',
    args: 'true',
    execute(client, message, args, punishmentLog) {
        const user = message.mentions.members.first() || client.users.resolve(args[0])
        if (!user) { return message.reply('Please mention a valid member of this server'); }
        const member = message.guild.members.cache.find(m => m.id === user.id)
        
        
        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided';

        message.channel.send(`${member.id}`)
        message.channel.send(`${member} has now been warned for ${reason}`)
    }
}