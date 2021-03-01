// checks if feature is true in the guilds config file
// if false returns a message reply that the feature is turned off by staff
const featureConfigCheck = async function(client, message, guild, feature) {
  //get currentGuildConfig
  const currentGuildConfig = await client.guildConfigs.get(guild.id);

  if (!currentGuildConfig) {return message.reply(`${guild.name} has not set up ${feature} yet`);}

  //if feature key in currentGuildConfig.features returns false the server turned the feature off
  if (!currentGuildConfig.features[feature]) {
    message.reply(
      `${guild.name} has chose not to have ${feature} in the server`,
    );
    return false;
  }
  return true;
};

const commandConfigCheck = async function(client, message, guild, command) {
  //get currentGuildConfig
  const currentGuildConfig = await client.guildConfigs.get(guild.id);

  if (!currentGuildConfig) {
    message.reply(`${guild.name} is not set up yet`);
    return false;
  }

  if (!currentGuildConfig.commands) {
    message.reply(
      `${guild.name} is not allowed to make any commands. Please set up the bot with \`!init\``,
    );
    return false;
  }

  const allowedCommand = currentGuildConfig.commands.find(
    (cmd) => cmd === command.name,
  );
  if (!allowedCommand) {
    message.reply(`${command.name} is not allowed in this guild`);
  }

  return true;
};

module.exports = {
  featureConfigCheck,
  commandConfigCheck,
};
