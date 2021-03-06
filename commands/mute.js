const ms = require('ms');

module.exports = {
  name: 'mute',
  description: 'Mutes the user for a specific time',
  args: 'true',
  usage: ': | <null> | <time> <reason> | <time>',
  guildOnly: 'true',
  staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy', '.'],
  log: 'true',
  execute(client, message, args) {
    const user =
      message.mentions.members.first() || client.users.resolve(args[0]);
    if (!user) {
      return message.reply('Please mention a valid member of this server');
    }
    const member = message.guild.members.cache.find((m) => m.id === user.id);

    const muterole = message.guild.roles.cache.find((r) => r.name === 'Muted');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = 'No reason provided';

    const time = args[1];

    if (!args[1]) {
      member.roles.add(muterole.id);
      return message.channel.send(
        `${member} has now been muted for ${reason} indefinitely`,
      );
    }
 else if (args[1] && args[2]) {
      //BUG reason becomes <time> if thats the only argument as time is a string apparently
      const reason = args.slice(2).join(' ');
      member.roles.add(muterole.id);
      message.channel.send(
        `${member} has now been muted for ${ms(ms(time))} for ${reason}`,
      );
    }
 else if (args[1] && !args[2]) {
      member.roles.add(muterole.id);
      message.channel.send(
        `${member} has now been muted for ${ms(ms(time))} for ${reason}`,
      );
    }

    setTimeout(function() {
      member.roles.remove(muterole.id);
      message.channel.send(`${member} now has been unmuted`);
    }, ms(time));
  },
};
