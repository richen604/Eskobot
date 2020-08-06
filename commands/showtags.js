module.exports = {
    name: "showtags",
    description: "shows all tags in database",
    guildOnly: "true",
    execute(client, message, args, Tags) {
            // equivalent to: SELECT name FROM tags;
        async function f() {
            
            //const tagList = await Tags.findAll()

            // returns an array of objects
            //const tagString = JSON.stringify(tagList) || 'No tags set.';


            const tagList = await Tags.findAll({ attributes: ['userid'] });
			const tagString = tagList.map(t => t.userid).join(', ') || 'No tags set.';

            return message.channel.send(`List of tags: ${tagString}`);
    }
    f()

}}