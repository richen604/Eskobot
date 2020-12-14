const { prefix } = require("../config.json");

module.exports = {
  name: "help",
  description: "List all of my commands or info about a specific command",
  usage: "[command name]",
  cooldown: 5,
  guildOnly: "true",
  execute(client, message, args) {
    const data = [];
    const { commands } = message.client;

    const currentGuildConfig = client.guildConfigs.find(
      (config) => config.guild === message.guild.id
    );

    if (!args.length) {
      data.push("Here's a list of all my commands:");
      data.push(
        commands
          .filter((command) =>
            currentGuildConfig.commands.includes(command.name)
          )
          .join(", ")
      );
      data.push(
        `\n You can send \`${prefix}help [command name]\` to get info on a specific command!`
      );

      return message.author
        .send(data, { split: true })
        .then(() => {
          if (message.channel.type === "dm") return;
          message.reply("I've send you a DM with all my commands!");
        })
        .catch((error) => {
          console.error(
            `Cound not send help DM to ${message.author.tag}.\n`,
            error
          );
          message.reply(
            "It seems like I can't DM you! Do you have DMs disabled?"
          );
        });
    }

    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find((c) => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("That's not a valid command!");
    } else if (!command.staffRoles) {
      return message.reply(
        "You don't have permission to use help for this command!"
      );
    }

    data.push(`**Name** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

    message.channel.send(data, { split: true });
  },
};
