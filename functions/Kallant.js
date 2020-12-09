const {
  strengthsMessageID,
  interestsMessageID,
  lfgVoteChannel,
  contentVoteChannel,
  rolesChannel,
  rulesChannel,
  strengthsObj,
  interestsObj,
  guildID,
  rulesMessageID,
  lfgHubParentID,
  contentHubParentID,
} = require("../config.json");

const ReactionAddHandler = async function (client, reaction, user) {
  const member = reaction.message.guild.members.cache.find(
    (u) => u.user === user
  );

  //ignore reaction listener if it is from a bot
  if (member.bot) return;

  // RULES FUNCTION
  if (reaction.message.id === rulesMessageID && reaction.emoji.name === "📚");
  {
    // Find role Pupil and add it to the user
    const role = reaction.message.guild.roles.cache.find(
      (roleFind) => roleFind.name === "Pupil"
    );
    member.roles.add(role);
  }

  // ROLES ADD FUNCTION
  //Strengths Role Add Function
  if (reaction.message.id === strengthsMessageID) {
    //collection of reactions that user is in
    const userReactions = reaction.message.reactions.cache.filter(
      (reactionFilter) => reactionFilter.users.cache.has(member.id)
    );
    const userReactionsArr = userReactions.keyArray();
    const firstReact = userReactions.last();

    //console logs if firstReact is undefined (bug)
    //BUG if the user reacts after bot restart it will not give correct role => reaction returns undefined
    //BUG If user reacts WITH REACTION after bot restart it not give correct role
    //TODO list user strengths roles, if has role remove all reacts and roles except one if the reaction is a role the user has

    //Strengths Roles exist check

    /*const roleCheck = member.roles.cache.filter(role => role.name === strengthsObj[reaction.emoji.name])
            if (!roleCheck || (reaction === roleCheck.last())) return
            console.log(`Comparing value: ${value} to roleCheck: ${roleCheck}`)
            await member.roles.remove(roleCheck)*/

    if (firstReact == undefined) {
      console.log(
        `Member id ${member.id} tried to select a Strength, may open ticket`
      );
      return;
      //Adds Strengths Role if first
    } else if (firstReact && firstReact.emoji.name === reaction.emoji.name) {
      const strengthsRole = reaction.message.guild.roles.cache.find(
        (r) => r.name === strengthsObj[firstReact.emoji.name]
      );
      await member.roles.add(strengthsRole);
      return;
      //Removes react if already selected a role
    } else if (firstReact && userReactionsArr.length > 1) {
      for (const reactionFind of userReactions.values()) {
        if (reactionFind.emoji.name === firstReact.emoji.name) return;
        await reaction.users.remove(member.id);
      }
      return;
    }
    return;
  }

  //INTERESTS ROLE ADD FUNCTION
  if (reaction.message.id === interestsMessageID) {
    //TODO if user has a strengthRole and applies an interestRole returns (vise versa)
    const interestsRole = reaction.message.guild.roles.cache.find(
      (r) => r.name === interestsObj[reaction.emoji.name]
    );
    await member.roles.add(interestsRole);
    return;
  }

  // VOTE ADD FUNCTION

  //LFG Vote Function
  if (reaction.message.channel.id === lfgVoteChannel) {
    //Changes lfgCount relative to how many channels exist
    const getLfgHub = client.channels.cache.filter(
      (c) => c.parentID === lfgHubParentID
    );
    const arr = getLfgHub.keyArray();
    console.log(`arr length is ${arr.length}`);
    let lfgCount = 3;
    if (arr.length > 1) {
      lfgCount = arr.length * 10;
    }
    console.log(`lfg count is ${lfgCount}`);
    //finds only the channels that are over lfg count
    const reactionCount = reaction.message.reactions.cache.find(
      (reactionFind) => reactionFind.count >= lfgCount
    );
    if (!reactionCount) return; // ignores reacts that aren't greater or equal to the first lfgCount
    await reaction.message.channel.messages.fetch(); //fetches the messages from cache

    // this gets the description for channel finding/making usage
    const category = reaction.message.embeds[0];
    const categoryName = category.fields[0].value
      .replace(/\s+/g, "-")
      .toLowerCase();

    const findCategoryContent = client.channels.cache.find(
      (c) => c.name === categoryName
    );
    const findCategoryLfg = client.channels.cache.find(
      (c) => c.name === categoryName
    );

    //check if message.content / channel.name exist in both contentHub or lfgHub
    if (findCategoryContent && findCategoryLfg) {
      return console.log(
        `LfgVote: Channel ${category.fields[0].value} already exists`
      );
    } else {
      const guild = client.guilds.cache.get(guildID);
      //creates channel in both Lfg-hub and Content-hub
      //LFG-Hub
      const lfgChannelCreate = await guild.channels.create(
        category.fields[0].value,
        {
          type: "text",
          parent: lfgHubParentID, // id of lfg-hub channel category
        }
      );
      lfgChannelCreate().catch((err) =>
        console.log("There was an error with making channel for LfgVote", err)
      );
      //Content-Hub
      const contentChannelCreate = await guild.channels.create(
        category.fields[0].value,
        {
          type: "text",
          parent: contentHubParentID, // id of lfg-hub channel category
        }
      );
      contentChannelCreate().catch((err) =>
        console.log(
          "There was an error with making channel for ContentVote",
          err
        )
      );
    }
  }

  //CONTENT VOTING
  /*if (reaction.channel.id === contentVoteChannel) {
        let contentCount = 3 //number of votes for content to be posted
        if (guild.memberCount > 50) {
            contentCount = (guild.memberCount / 10)
        }
        let reactionCount = reaction.message.cache.find(reaction => reaction.count >= contentCount)
        if (!reactionCount) return;
    }*/
};

const ReactionRemoveHandler = async function (client, reaction, user) {
  // only listen for reactions in channels we want to handle reactions
  if (
    !reaction.message.channel.id ===
    (lfgVoteChannel || contentVoteChannel || rolesChannel || rulesChannel)
  ) {
    return;
  }
  // if partial check
  if (reaction.partial) {
    // try catch for fetching
    try {
      await reaction.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
      return;
    }
  }

  const guildId = reaction.message.guild.id;
  // ignore other servers until i set them up
  if (guildId !== "731220209511432334") return;
  const member = reaction.message.guild.members.cache.find(
    (u) => u.user === user
  );

  // Roles Removal Function

  //Strengths Role
  if (reaction.message.id === strengthsMessageID) {
    const strengthsRole = reaction.message.guild.roles.cache.find(
      (r) => r.name === strengthsObj[reaction.emoji.name]
    );
    await member.roles.remove(strengthsRole);
  }
  //Interests Role
  if (reaction.message.id === interestsMessageID) {
    //TODO if user has a strengthRole and applies an interestRole returns (vise versa)
    const interestsRole = reaction.message.guild.roles.cache.find(
      (r) => r.name === interestsObj[reaction.emoji.name]
    );
    await member.roles.remove(interestsRole);
    return;
  }

  // TODO Add Vote Removal Function
  // Vote Removal Function
};

module.exports = {
  ReactionAddHandler,
  ReactionRemoveHandler,
};
