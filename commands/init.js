const { disconnect } = require("pm2");

/*
REQUIREMENT REFACTORING BEFORE INIT COMMAND WILL WORK
- function for staff roles in modules
- config folder for each server
- function for handling default config


INIT COMMAND TODOS
- function to create config file (during init)
- embeds to select options
- message listeners to input data
- input staff role names
- select default settings or custom
- custom settings requires supplying a json as an attachement to a message listener
- create ticket channel if modmail was selected
- select features on / off


UNSORTED NOTES:
- How will I add the guild config without restart
    - function that turns config jsons into and array of objects
        - push new init object to the array of objects


-Starts a selector embed
    -includes server name and bot name
    -checks if guild config exists already in configs
        -if so prompts if the user wants to restart their config
    -tells user that staff roles are required and to have permissions in mind, roles with emotes or special characters may not work
        - Example: 
            role name Admin is allowed to !kick !ban
            role name Staff is only allowed to !kick
    -ask if user wants default options
        - Modmail on
        - Punishment Log is on
        - default commands
        -channels (tell user that the names are able to be changed, and that the bot needs to create the channel to operate)
            - Eskobot-Tickets Category
            - Eskobot-Staff-Logs
            - Eskobot-GetRoles
    - prompt user to create roles
- Main functions
    - config.json layout
        "guild": <guild id>
        "CreateStaffRoles": true,
        "Modmail": true,
        "PunishmentLog": true,
    - function to create array of objects(configs) and push new inits to them
        -this array will be used to handle guild options throughout the main program
    - THISGUILD = guildOptionsArr.find(options => options.guild === message/reaction/etc GUILD.id)
        - used to find if guild is in options if false return a message (please init your guild before continuing)
        - THISGUILD.Modmail === false => return
    - on Guild remove delete the config and remove the guild from the configArr
    - 

*/
const Discord = require("discord.js");

module.exports = {
  name: "init",
  description: "starts prompt to create bot features",
  cooldown: "600",
  guildOnly: "true",
  execute(client, message) {
    //reaction array for use throughout the function
    const numberReactions = [
      "1⃣",
      "2⃣",
      "3⃣",
      "4⃣",
      "5⃣",
      "6⃣",
      "7⃣",
      "8⃣",
      "9⃣",
      "🔟",
    ];
    const exitReaction = "🗑️";
    const yesReaction = "✅";
    const noReaction = "⭕";
    //Create an Embed to be used for prompt
    const GuildPromptEmbed = new Discord.MessageEmbed()
      //TODO Change color and create .setThumbnail for bot pfp
      .setColor("#6A0DAD")
      .setTitle(`Welcome to Eskobot ${message.username}`)
      .setDescription(
        "Before you begin, please select the server you are directing your message to."
      )
      //.setThumbnail(member.avatarURL())
      .setFooter("Note: Misuse of Modmail may lead to punishment.")
      .setTimestamp();
  },
};
