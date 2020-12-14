const Discord = require("discord.js");

module.exports = {
  name: "reply",
  description: "replies to a ticket as staff, either as staff or anon",
  guildOnly: "true",
  staffRoles: ["Exec. Director", "Board Member", "Staff"],
  args: "true",
  usage: "<message> || <anon> <message",
  execute(client, message, args) {
    const currentGuildConfig = client.guildConfigs.get(message.guild.id);

    // if channel isnt in parent category of Ticket, return
    if (message.channel.parentID !== currentGuildConfig.ticketParentId) return;

    //turn user into member
    const user = message.author;
    const member = message.guild.members.cache.find((m) => m.id === user.id);
    // TODO make an object of staffRoles to include hex of role color, including it into the embed
    const staffRoles = ["Exec. Director", "Board Member", "Staff", "Comfy"];

    const role = member.roles.cache.find((r) => staffRoles.includes(r.name));

    const dmUserId = message.channel.name.split("-")[1];

    //const for userid to dm
    const dmUser = client.users.cache.get(dmUserId);
    // const for channel to dm into
    //if arg[0] anon send message as anon, else send as staff
    if (args[0] === "anon") {
      const r = args.slice(1, args.length).slice(",").join(" ");
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#6A0DAD")
        .setTitle(`Modmail Message`)
        // TODO .setThumbnail(LINK TO BOT PFP)
        .addField(`Staff:`, `${r}`);
      return dmUser.send(exampleEmbed);
    } else {
      const r = args.slice(0, args.length).slice(",").join(" ");
      const exampleEmbed = new Discord.MessageEmbed()
        .setColor("#6A0DAD")
        .setTitle(`Modmail Message`)
        .setThumbnail(user.avatarURL())
        .addField(`${role.name}:`, `${r}`);
      return dmUser.send(exampleEmbed);
    }
  },
};
