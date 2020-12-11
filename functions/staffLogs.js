const { featureConfigCheck } = require("./checks.js");
const Discord = require("discord.js");

const MessageDeleteHandler = async function (client, message) {
  const staffLogCheck = await featureConfigCheck(
    client,
    message,
    message.guild,
    "StaffLog"
  );
  if (!staffLogCheck)
    return console.log(
      `${message.guild.name} Has not set up Staff Logging Feature`
    );

  if (message.partial) {
    // try catch for fetching
    try {
      await message.fetch();
    } catch (error) {
      if (error === "DiscordAPIError: Unknown Message") {
        return console.log(
          "User deleted a message prior to bot update, wont log"
        );
      } else {
        return console.log(
          "Something went wrong when fetching the message: ",
          error
        );
      }
    }
  }

  //get staffLogChannel from currentGuildConfig
  const currentGuildConfig = client.guildConfigs.get(message.guild.id);
  const staffLogId = currentGuildConfig.channels["staffLogId"];
  const staffLogChannel = message.guild.channels.cache.get(staffLogId);
  try {
    message.channel.messages.cache.find((m) => m.id === message.id);
  } catch (error) {
    console.log(
      "Something went wrong when trying to fetch message from cache in messageDelete",
      error
    );
  }

  const member = message.guild.members.cache.find(
    (u) => u.user === message.author
  );

  try {
    if (!member) return;
    if (member.bot) return;
    if ((message.content || message.author) === undefined)
      return console.log(
        "Probably tried to delete a message before bot restart, won't log"
      );
  } catch (error) {
    return console.log(
      "There was an error in conditions of messageDelete",
      error
    );
  }
  try {
    const deleteEmbed = new Discord.MessageEmbed()
      .setColor("BLUE")
      //TODO Add Garbage Can Icon to Author deleteEmbed
      .setAuthor("User Delete A Message")
      .setDescription(
        `ID: ${message.id} | In: ${message.channel}\nUser: ${message.author} \`${message.author.tag} , ${message.author.id}\``
      )
      .addField("_ _", `Message Content: \`${message.content}\``);
    staffLogChannel.send(deleteEmbed);
  } catch (error) {
    return console.log(
      "There was an error sending a MessageDeleteHandler message to the Staff Log Channel",
      error
    );
  }
  return;
};

const MessageUpdateHandler = async function (client, oldMessage, newMessage) {
  if (!oldMessage.guild || !newMessage.guild) return;

  if (oldMessage.partial) {
    // try catch for fetching
    try {
      await oldMessage.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
      return;
    }
  }

  try {
    oldMessage.channel.messages.cache.find((m) => m.id === oldMessage.id);
  } catch (error) {
    console.log("Something went wrong with fetching the message id", error);
  }

  if (oldMessage.content === undefined)
    return console.log(
      "oldMessage is returning undefined, probably edited a message before bot was restarted. May not log"
    );

  if (newMessage.partial) {
    // try catch for fetching
    try {
      await newMessage.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
      return;
    }
  }

  //get staffLogChannel from currentGuildConfig
  const currentGuildConfig = client.guildConfigs.get(newMessage.guild.id);
  const staffLogId = currentGuildConfig.channels["staffLogId"];
  const staffLogChannel = newMessage.guild.channels.cache.get(staffLogId);

  try {
    if (newMessage.author.bot || oldMessage.author.bot) return;
  } catch (error) {
    console.log(
      `Message Edit Listener Error: Checking if message editor is a bot returned an error, \n ${error}`
    );
  }

  const user = oldMessage.guild.members.cache.find(
    (u) => u.user === newMessage.author
  );

  try {
    if (user.bot) return;
  } catch (error) {
    console.log(
      `Message Edit Listener Error: checking if user is bot returned an error, \n ${error}`
    );
  }

  const editEmbed = new Discord.MessageEmbed()
    .setColor("YELLOW")
    .setAuthor("User Edited a Message")
    .setDescription(
      `Message ID: ${newMessage.id} in ${newMessage.channel} \nUser: ${newMessage.author} \`${newMessage.author.tag}, ${newMessage.author.id}\``
    )
    .addFields(
      { name: "Old Message:", value: `${oldMessage.content}` },
      { name: "New Message", value: `${newMessage.content}` }
    );

  staffLogChannel.send(editEmbed);
};

const MemberAddHandler = async function (client, member) {
  //get staffLogChannel from currentGuildConfig
  const currentGuildConfig = client.guildConfigs.get(member.guild.id);
  const staffLogId = currentGuildConfig.channels["staffLogId"];
  if (!staffLogId) return; //usually return a message or console log but this would spam
  const staffLogChannel = member.guild.channels.cache.get(staffLogId);

  const dateJoined = ms(member.user.createdTimestamp);
  const memberAddEmbed = new Discord.MessageEmbed()
    .setColor("GREEN")
    //TODO add green check to author
    .setAuthor("User Joined The Server")
    .setDescription(`User: ${member} | \`${member.user.tag}, ${member.id}\` `)
    .addField("User Joined Discord:", `${dateJoined}`);
  staffLogChannel.send(memberAddEmbed);
};

const MemberRemoveHandler = function (client, member) {
  //get staffLogChannel from currentGuildConfig
  const currentGuildConfig = client.guildConfigs.get(member.guild.id);
  const staffLogId = currentGuildConfig.channels["staffLogId"];
  if (!staffLogId) return; //usually return a message or console log but this would spam
  const staffLogChannel = member.guild.channels.cache.get(staffLogId);

  const timeLeft = ms(Date.now() - member.joinedAt);
  const memberRemoveEmbed = new Discord.MessageEmbed()
    .setColor("RED")
    .setAuthor("User Left The Server")
    .setDescription(`User: ${member} | \`${member.user.tag}, ${member.id}\` `)
    .addField("User Left The Server After:", `${timeLeft}`);
  staffLogChannel.send(memberRemoveEmbed);
};

module.exports = {
  MessageDeleteHandler,
  MessageUpdateHandler,
  MemberAddHandler,
  MemberRemoveHandler,
};
