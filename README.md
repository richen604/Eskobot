# Eskobot

Discord Moderation Bot built with discord.js

## Local Development

- `git clone`, `git fork`, etc this repository
- `npm install` to get required packages
- reference `.env.example` and add the following to a `.env` file
- create a discord server for local testing and follow [this guide](https://discordjs.guide/creating-your-bot/#creating-the-bot-file)
- reference `configs/GuildTemplate.json` and create one for your guild
- run `npm run dev` for a nodemon instance to start the bot
- run `npm run start` for production

## Contributing

Fork this repository. Using the above local development changes, set up your own discord bot token [here](https://discord.com/login?redirect_to=%2Fdevelopers%2Fapplications)
If you are new to creating bots there's a great guide to reference [here](https://discordjs.guide/creating-your-bot/#creating-the-bot-file)

Make a new branch for your changes and add it to the forked repository you created. Name it related to your fix / refactor `eg. hotfix-modmail-feature`.
Then, make a pull request with your changes and our team will review it.

## TODO

#### Planned Major Changes:

##### General:

- [ ] Migrating from Sequelize to MongoDB
- [ ] Guild init command / static form - Migrate from `configs/*.json`

##### Modmail

- [ ] Staff Auto-Ticket command
- [ ] Ticket Reason / Close Logging
- [ ] Ticket Tagging

##### Staff Logging:

- [ ] Staff Log Filtering
- [ ] Custom Role Handler
- [ ] Multiple Channel Option

#### Minor Changes:

- [ ] Unit Testing
- [ ]
- [ ]
- [ ]
