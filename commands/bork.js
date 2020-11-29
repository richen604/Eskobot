module.exports = {
    name: 'bork',
    description: 'Makes esko bork back in multiple ways',
    cooldown: '5',
    guildOnly: 'true',
    execute(client, message) {
        const bork = ['Björk', 'bork bork bork!', 'BORK!!!!!!!!!!', 'Gr.....', '*whimpers...*', '*glares*', 'bark!', 'boof', 'ruff', 'BOOF'];
        const random = Math.floor(Math.random() * 10);
        // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
        message.delete().catch(O_o => {});
        // And we get the bot to say the thing:
        message.channel.send(bork[random]);
    },
};