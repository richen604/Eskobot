module.exports = {
    name: 'ping',
    description: 'Calculates ping between sending a message and editing it, giving a nice round-trip latency.',
    guildOnly: 'true', 
    staffRoles: ['Exec. Director', 'Board Member', 'Staff', 'Comfy', '.'],
    execute(client, message) {
        message.channel.send('Ping?').then(sentMessage => sentMessage.edit(`Pong! Latency is ${sentMessage.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`));
    },
};