require('dotenv').config();
const Discord = require('discord.js');
const { rolesChannel } = process.env;

module.exports = {
  name: 'interests',
  description: 'posts an embed for interests roles, Admin Only',
  staffRoles: ['Exec. Director'],
  guildOnly: 'true',
  execute(client, message) {
    const interestsObj = {
      '🧩': 'Art and Design',
      '👔': 'Business',
      '💻': 'Computer Science',
      '🖥️': 'Data Science',
      '🦺': 'Engineering',
      '📌': 'Education and Teaching',
      '💉': 'Health and Medicine',
      '🔎': 'Humanities',
      '⌨️': 'Programming',
      '🗿': 'Personal Development',
      '📐': 'Mathematics',
      '🔬': 'Sciences',
      '💡': 'Social Sciences',
    };

    if (message.channel.id !== rolesChannel) return;
    
    // eslint-disable-next-line no-unused-vars, no-empty-function
    message.delete().catch((O_o) => {});
    const interestsEmbed = new Discord.MessageEmbed().setDescription(
      '---------------------**React to this message for an Interests Role!**--------------------- \nMultiple Roles available, show people what you want to learn!',
    );
    for (const key in interestsObj) {
      interestsEmbed.addFields({
        name: '_ _',
        value: `${interestsObj[key]}`,
        inline: true,
      });
    }
    async function f() {
      const msg = await message.channel.send(interestsEmbed);
      for (const key in interestsObj) {
        msg.react(key);
      }
      console.log(`set interestsMessageID in config.js to: ${msg.id}`);
    }
    f();

    return;
  },
};
