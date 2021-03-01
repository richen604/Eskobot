const Discord = require('discord.js');
//const { punishmentLog } = require('./guildLogs');
const { featureConfigCheck } = require('./checks');

const logPunishment = async function (
    client,
    message,
    args,
    punishmentLog,
    command,
) {
    const member =
        message.mentions.members.first() ||
        client.users.resolve(args[0]) ||
        (await message.guild.members.fetch(args[0]));

    //checks if punishmentLog true in guildconfig
    if (!featureConfigCheck(client, message, message.guild, 'PunishLog'))
        return;

    //get currentGuildConfig
    const currentGuildConfig = await client.guildConfigs.get(message.guild.id);

    let reason = args.slice(1).join(' ');
    if (!reason) reason = 'No reason provided';

    //mute command handling
    if (command.name === 'mute') {
        if (args[1] && args[2]) {
            reason = args.slice(2).join(' ');
        } else if (args[1] && !args[2]) {
            reason = 'No reason provided';
        }
    }

    const channel = client.channels.cache.get(
        currentGuildConfig.channels['staffLogId'],
    );
    if (!channel) {
        return message.reply(
            'Could not find a staffLogChannel. Please set up Eskobot via init',
        );
    }

    const log = await punishmentLog.create({
        guildid: message.guild.id,
        userid: member.id,
        username: member.tag,
        punishment: command.name,
        reason: reason,
        staffName: `<@${message.author.id}>`,
    });
    // sends to channel in server for staff log
    if (channel) {
        const staffActionLogEmbed = new Discord.MessageEmbed()
            .setColor('PURPLE')
            .setAuthor('Staff Action Log')
            .setDescription(
                `Done by Staff ${log.staffName} to User: ${log.username} \`${log.userid}\``,
            )
            .addField(`Action: ${log.punishment}`, `Reason: ${log.reason}`)
            .setFooter(`User Log ID: ${log.id}`);
        channel.send(staffActionLogEmbed);
    }
    return;
};

module.exports = {
    logPunishment,
};
