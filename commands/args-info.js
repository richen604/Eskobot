module.exports = {
    name: 'args-info',
    description: 'Information about the arugments provided',
    guildOnly: 'true',
    execute(client, message, args) {
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }
        message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
    },
};