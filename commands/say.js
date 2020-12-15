module.exports = {
  name: "say",
  description:
    "takes given message and says it through the bot in a given channel",
  usage: "<channel> <message> || <channel.id> <message>",
  cooldown: "5",
  guildOnly: "true",
  execute(client, message, args) {
    const channel = message.guild.channels.cache.get(args[0]) || args[0];
    if (!channel) message.reply("Please include a valid channel or channel id");

    const sayMessage = args.slice(1, args.length).slice(",").join(" ");
    if (!sayMessage) message.reply("Please include a message with channel");

    channel.send(sayMessage).catch((err) => {
      console.log("Error with sending message to channel in say command", err);
    });
    return;
  },
};
