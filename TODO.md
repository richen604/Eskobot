NEXT COMMIT


TODO spam check similar to LFG
+ installed a spam package from npm to do a similar function, temporary
+ initialize antispam module in eskobot.js

TODO ROLES: emote role setter
*expected function*
user clicks on emote in message and gets the role assigned
*possible way to get there*
- have an event handler for reacting on specific messages and a command to add the message id to the handler?
- could also have the ids manually pasted in config.json in an array

TODO CONTENT: emote voting function
*expected function*
reacts for specific messages vote for the content to be posted in another channel
*possible ways to get there*
- user or staff !startVote command? takes link as arg and starts an event handler?
- have the amount of votes required in a const, maybe editable by the command by staff?

TODO INCENTIVES 10 invites gets you nitro


DONE CONTENT: !populate command => takes an array or set of links and posts them to a channel, usage: <channel> <array/set> (JSON FILE?)
+ created a barebones channel send function
Getting getting website content requires webscraping


TODO FUN use canvas to set up a welcome image for users

TODO: USER HISTORY: Function to send (reason) to user database
Using Sequelize and SQLite3
visit https://discordjs.guide/sequelize/#alpha-connection-information

+ Set up database for userids, usernames, punishments, punishementtime
+ set up placeholder commands to show and add data to tables
+ change tags table to punishmentLog
+ add staffname column to punishmentLog
+ change showtags name and function to display specific username/id history rather than all
+ show content in an embed
+ update embed to look better
- finish the guide for the rest of the commands
(optional)
- change addtag to take args of the columns

// TODO USER HISTORY: separate log by servers
- add guild id to database
- include check for guild database before showing log in the forEach() statement

// DONE LOGGING Mod history in a channel
- connect punishmentsLog to a channel in eskobot.js
- when a punishment is sent, send a message to staffLog channel using existing methods
-

// TODO LOGGING: Logging for edited and deleted messages
- post it to a channel?

// TODO ERROR: change server messages for bot to dm for errors

// TODO HELP: help should be dm as well

// TODO TICKETS: Modmail Bot
/* TODO Modmail bot:
+ Ticket Channel Category
+ bot responds to dms with a placeholder
- User messages bot => bot creates channel in ticket channel
- Staff are pinged on ticket open
- !close {reason} closes the ticket
- tickets have an embed for a todo script for handling
- !reply [reply] sends a response to the user => so staff can discuss the ticket
- anti spam on ticket
- anti group chat for bot */

// TODO BAN APPEAL: Ban Appeals google docs

// TODO LOGGING: Logs vc join and leave



TODO EVENTS use collectors in guide to set up event starting and ending

TODO !nick command to change nickname

// DONE: REFACTORING: Module check for staff rather than function feature