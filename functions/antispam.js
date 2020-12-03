const AntiSpam = require('discord-anti-spam');

const antispamInit = function() {
    const antispam = new AntiSpam({
        warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
        kickThreshold: 7, // Amount of messages sent in a row that will cause a ban.
        banThreshold: 7, // Amount of messages sent in a row that will cause a ban.
        maxInterval: 2000, // Amount of time (in milliseconds) in which messages are considered spam.
        warnMessage: '{@user}, Please stop spamming.', // Message that will be sent in chat upon warning a user.
        kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
        banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
        maxDuplicatesWarning: 7, // Amount of duplicate messages that trigger a warning.
        maxDuplicatesKick: 10, // Amount of duplicate messages that trigger a warning.
        maxDuplicatesBan: 12, // Amount of duplicate messages that trigger a warning.
        exemptPermissions: [ 'ADMINISTRATOR', 'KICK_MEMBERS', 'BAN_MEMBERS'], // Bypass users with any of these permissions.
        ignoreBots: false, // Ignore bot messages.
        verbose: true, // Extended Logs from module.
        ignoredUsers: [], // Array of User IDs that get ignored.
        // And many more options... See the documentation.
    });

    return antispam;
};

module.exports = {
    antispamInit,
};