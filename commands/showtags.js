module.exports = {
    name: 'showtags',
    description: 'shows all tags in database',
    guildOnly: 'true',
    staffRoles: ['Exec. Director', '+', '.'],
    execute(client, message, args, punishmentLog) {
            // equivalent to: SELECT name FROM tags;
        async function f() {
            
            //const tagList = await Tags.findAll()

            // returns an array of objects
            //const tagString = JSON.stringify(tagList) || 'No tags set.';


            const tagList = await punishmentLog.findAll();
			const tagString = JSON.stringify(tagList) || 'No tags set.';

            return message.channel.send(`List of tags: ${tagString}`);
    }   
    f();

} };