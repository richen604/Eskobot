module.exports = {
  name: 'kick',
  aliases: ['boot'],
  description: 'Boots a user out of the server',
  guildOnly: 'true',
  staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy', '.'],
  log: 'true',
  args: 'true',
  execute(client, message, args) {
    // user mention check
    const user =
      message.mentions.members.first() || client.users.resolve(args[0]);
    if (!user) {
      return message.reply('Please mention a valid member of this server');
    }
    if (!user.kickable) {
      return message.reply(
        'I cannot kick this user! Do they have a higher role? Do I have kick permissions?',
      );
    }
    const member = message.guild.members.cache.find((m) => m.id === user.id);
    // reason join function / check
    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'No reason provided';

    member.kick(reason).catch((err) => {
      console.log(err);
      message.reply(
        `Sorry ${message.author} I couldn't kick because of : ${err}`,
      );
    });
    message.reply(
      `${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`,
    );
  },
};
