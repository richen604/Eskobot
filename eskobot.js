/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
const fs = require("fs");
const ms = require("ms");
const Discord = require("discord.js");
const {
  prefix,
  token,
  staffLogChannel,
  strengthsMessageID,
  interestsMessageID,
  lfgVoteChannel,
  contentVoteChannel,
  rolesChannel,
  rulesChannel,
  strengthsObj,
  interestsObj,
  guildID,
} = require("./config.json");
const modmail = require("./functions/modmail");
const Kallant = require("./functions/Kallant");
const punishmentLogger = require("./functions/punishmentLog");
const checks = require("./functions/checks");
const antiSpamFunc = require("./functions/antispam");
const guildLogs = require("./functions/guildLogs");
const staffLog = require("./functions/staffLogs");

const antiSpam = antiSpamFunc.antispamInit();

// MASTER TODO LIST
//TODO Refactor to allow for multiple servers

//TODO Refactor Modmail to allow for multiple servers
//TODO Refactor Role Message React feature to allow for multiple servers
//TODO Refactor to migrate from needing a config.json. or to be able to edit config.json within server (preferred)

//TODO init command function

//TODO set up an init command to set up server functions like staff log and modmail ticket channels

const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// sequelize initialization for punishmentLog and ticketLog
const { punishmentLog, ticketLog } = guildLogs.guildLogsInit();

// Grabs commands and Kallant folder files to import into an array
client.commands = new Discord.Collection();
client.guildConfigs = new Discord.Collection();

// Cooldowns initialization for later
const cooldowns = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
const guildFiles = fs
  .readdirSync("./configs")
  .filter((file) => file.endsWith(".json"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

for (const file of guildFiles) {
  const singleGuildConfig = require(`./configs/${file}`);
  client.guildConfigs.set(singleGuildConfig.guild, singleGuildConfig);
}

// sync Sequelize tables
punishmentLog.sync();
ticketLog.sync();

// Bot start
client.on("ready", async () => {
  console.log(
    `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
  );
  client.user.setActivity("Message me for help!");
  //TODO find a way to do a quick react/unreact feature to debug listeners
});

client.on("guildCreate", (guild) => {
  console.log(
    `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`
  );
  client.user.setActivity("Message me for help!");
});

client.on("guildDelete", (guild) => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity("Message me for help!");
});

// CLIENT ON MESSAGE

client.on("message", async (message) => {
  // ignore bots/self
  if (message.author.bot) return;

  //init some consts for the rest of the event handler
  const messageUser = message.author;
  let messageMember = undefined;
  let messageGuild = undefined;
  if (message.guild) {
    messageMember = await message.guild.members.fetch(messageUser.id);
    messageGuild = message.guild.id;
  }
  const botGuildsId = client.guilds.cache.map((guild) => guild.id);

  //inits antiSpam package
  antiSpam.message(message);

  // split command and args, args being sliced array
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // command init
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  // If message is not in guild
  //MODMAIL FUNCTION
  if (!command && message.channel.type !== "text") {
    //builds an array of guilds the user is a member in
    let memberGuildsArr = [];
    botGuildsId.forEach((guildId) => {
      const guild = client.guilds.cache.get(guildId);
      if (guild.members.fetch(messageUser.id)) {
        memberGuildsArr.push(guild);
      }
    });

    //Call a function to prompt user for feedback via an Embed Message to React to only if there are multiple guilds the user is in
    let guild = undefined;
    if (memberGuildsArr.length > 1) {
      guild = await modmail.ModmailGuildPrompt(
        message,
        messageUser,
        memberGuildsArr
      );
      if (!guild) return;
    }
    //if only one guild just grabs first guild that member is in
    if (memberGuildsArr.length === 1) {
      guild = memberGuildsArr[0];
    }

    //check for modmail off in guildConfig
    if (!checks.featureConfigCheck(client, message, guild, "Modmail")) return;

    //we don't need memberGuildArr anymore
    memberGuildsArr = undefined;

    if (!guild) return;
    //Handle channel checking and embed messages
    await modmail.ChannelMessageHandler(
      client,
      message,
      guild,
      messageUser,
      punishmentLog
    );
    return;
  } else if (!command) {
    // INIT REACT FOR CONTENT VOTING
    /*if (message.channel.id === contentVoteChannel){
            await message.react('👍')
        } else {
            return;
        }*/
  } else if (
    message.content.startsWith(prefix) &&
    command.guildOnly &&
    message.channel.type !== "text"
  ) {
    return;
  }

  //Returning if theres no command or message isn't prefix
  if (!command && !message.content.startsWith(prefix)) return;

  //START COMMAND HANDLING LOGIC

  if (command.staffRoles) {
    if (
      !message.member.roles.cache.some((r) =>
        command.staffRoles.includes(r.name)
      )
    ) {
      return message.reply("Sorry, you don't have permissions to use this!");
    }
  }
  // Arguments and staff check => args-info.js
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;

    if (command.usage && command.staffRoles) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(
      client,
      message,
      args,
      punishmentLog,
      rolesChannel,
      strengthsObj
    );
  } catch (error) {
    console.error(error);
    message.reply(`Couldn't execute that command because of \`${error}\``);
  }

  // logs punishment if log is true in module
  if (command.log) {
    try {
      punishmentLogger.logPunishment(
        client,
        message,
        args,
        punishmentLog,
        command
      );
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return message.reply("That log already exists.");
      }
      console.log(error);
      return message.reply("Something went wrong with adding a log.");
    }
  }
});

// AntiSpam Error Logging

antiSpam.on("error", (message, error, type) => {
  console.log(
    `${message.author.tag} couldn't receive the sanction '${type}', error: ${error}`
  );
});

// Client Reaction listener

client.on("messageReactionAdd", async (reaction, user) => {
  // if partial check
  if (reaction.partial) {
    // try catch for fetching
    try {
      await reaction.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
      return;
    }
  }

  //if reaction is not in the server return
  if (!reaction.message.guild) return;

  //guild declaration
  const guildId = reaction.message.guild.id;

  // Kallant ReactionAddHandler
  if (guildId !== "731220209511432334") return;
  Kallant.ReactionAddHandler(client, reaction, user).catch((err) => {
    console.log("There was an error with Kallants ReactionAddHandler");
    console.log(err);
  });
});

client.on("messageReactionRemove", async (reaction, user) => {
  //guild declaration
  const guildId = reaction.message.guild.id;

  // Kallant ReactionRemoveHandler
  if (guildId !== "731220209511432334") return;
  Kallant.ReactionRemoveHandler(client, reaction, user).catch((err) => {
    console.log("There was an error with Kallants ReactionRemoveHandler");
    console.log(err);
  });
});

// Client message delete logger

client.on("messageDelete", async (message) => {
  if (!message.guild) return;

  staffLog.MessageDeleteHandler(client, message).catch((err) => {
    console.log("There was an error with MessageDeleteHandler", err);
  });
});

// Client message edit logger

client.on("messageUpdate", async (oldMessage, newMessage) => {
  staffLog.MessageUpdateHandler(client, oldMessage, newMessage);
});

client.on("guildMemberAdd", (member) => {
  const staffLog = client.channels.cache.get(staffLogChannel);
  const dateJoined = ms(member.user.createdTimestamp);
  const memberAddEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    //TODO add green check to author
    .setAuthor("User Joined The Server")
    .setDescription(`User: ${member} | \`${member.user.tag}, ${member.id}\` `)
    .addField("User Joined Discord:", `${dateJoined}`);
  staffLog.send(memberAddEmbed);
});

client.on("guildMemberRemove", (member) => {
  const staffLog = client.channels.cache.get(staffLogChannel);
  const timeLeft = ms(Date.now() - member.joinedAt);
  const memberRemoveEmbed = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor("User Left The Server")
    .setDescription(`User: ${member} | \`${member.user.tag}, ${member.id}\` `)
    .addField("User Left The Server After:", `${timeLeft}`);
  staffLog.send(memberRemoveEmbed);
});

client.login(token);
