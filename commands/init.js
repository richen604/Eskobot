/*
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