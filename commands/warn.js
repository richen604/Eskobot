const log  = require('../events/logpunishment.js');
const logpunishment = require('../events/logpunishment.js');


module.exports = {
    name: "warn",
    description: 'warns the player, giving a reason for the warning',
    usage: '!warn <reason>',
    staffRoles: ['Exec.Director', 'Board Member', 'Staff', 'Comfy'],
    log: 'true',
    execute(client, message, args, punishmentLog) {
        const member = message.mentions.members.first() || client.users.resolve(args[0]);
        if (!member) { return message.reply('Please mention a valid member of this server'); }

        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No reason provided';

        message.channel.send(`${member} has now been warned for ${reason}`)

    }


}