module.exports = {
    name: 'purge',
    args: 'true',
    usage: '<number-of-messages>',
    cooldown: '5',
    description: 'Removes all messages from all users in the channel, up to 100.',
    guildOnly: 'true',
    execute(client, message, args) {

        if (!message.member.roles.cache.some(r => ['Exec. Director', 'Board Member', 'Comfy'].includes(r.name))) { return message.reply('Sorry, you don\'t have permissions to use this!'); }
        // get the delete count, as an actual number.
        const deleteCount = parseInt(args[0], 10);

        // Ooooh nice, combined conditions. <3
        if (!deleteCount || deleteCount < 2 || deleteCount > 100) { return message.reply('Please provide a number between 2 and 100 for the number of messages to delete'); }

        // So we get our messages, and delete them. Simple enough, right?
        message.channel.bulkDelete(deleteCount, true).catch(err => {
            console.log(err);
            message.reply(`Couldn't delete messages because of: ${err}`);
        });
    },
};