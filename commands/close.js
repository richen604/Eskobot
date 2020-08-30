module.exports = {
    name: "close",
    description: "closes modmail ticket with reason",
    usage: "<null> || <reason>",
    execute(client, message, args) {
        //TODO make a ticket database including reason, userid, staff that closed ticket
        if (message.channel.parentID !== '747457097762865203') return

        // close ticket
        message.channel.delete()


    }
}