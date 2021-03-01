const { featureConfigCheck } = require('../functions/checks');

module.exports = {
  name: 'close',
  description: 'closes modmail ticket with reason',
  usage: '<null> || <reason>',
  staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy', '.', '+'],
  execute(client, message) {
    if (!featureConfigCheck(client, message, message.guild, 'Modmail')) return;

    const currentGuildConfig = client.guildConfigs.get(message.guild.id);

    //TODO make a ticket database including reason, userid, staff that closed ticket

    if (message.channel.parentID !== currentGuildConfig.ticketParentId) return;

    // close ticket
    message.channel.delete();
  },
};
