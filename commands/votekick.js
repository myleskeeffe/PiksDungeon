const { db } = require("../util/db");
const { BOT_NAME, TEST_MODE } = require("../config.json")
const { MessageEmbed } = require("discord.js");
const { hasAdminPerms } = require("../util/EvobotUtil")


module.exports = {
    name: "votekick",
    aliases: ["vk"],
    description: "Vote to Kick someone. \n Use .vk help for more info",
    execute(message, args) {
        if (!args.length) {
            message.reply("I didn't get that. Please check .vk help")
        }
        else if (args[0].toLowerCase() == "help") {

            let helpEmbed = new MessageEmbed()
                .setTitle(BOT_NAME)
                .setDescription("Vote Kick")
                .setColor("#F8AA2A");

            helpEmbed.addField('**.vk @<user>**', 'Start a Votekick against @<user>', true)
            helpEmbed.addField('**.vk config set allowedrole @<role>**', 'Set a role which can start/vote on VoteKicks.', true)
            helpEmbed.addField('**.vk config get allowedrole**', 'See which role can start/vote on VoteKicks.', true)
            helpEmbed.addField('**.vk config set minvotes <num>**', 'Set minimum number of votes for VoteKick to succeed.', true)
            helpEmbed.addField('**.vk config get minvotes**', 'See minimum number of votes for VoteKick to succeed.', true)

            return (message.channel.send(helpEmbed).catch(console.error));
        }
        else if (args[0].toLowerCase() == "config") {
            // Allows for Setting Config Values - Check if Set is Second Arg
            if (args[1].toLowerCase() == "set") {
                // Check if user has admin perms - if not exit with message
                if (!hasAdminPerms(message.guild.member(message.author))) {
                    return (message.reply("Sorry you do not have the perms to run this command."));
                }
                // Check correct number of arguments was supplied for the set commandm else return
                if (!args[2] || !args[3]) {
                    return (message.reply("Please check .vk help for info on how to use this command. (Incorrect number of Arguments)"));
                }
                // Convert 3rd argument to lower case, and compare it
                switch (args[2].toLowerCase()) {
                    // Set the allowed role. I.E. The roles which are allowed to start/vote on votekicks
                    case 'allowedrole':
                        async function setallowedrole() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkAllowedRole';
                            try { await db.put(keyId, message.mentions.roles.first().id); }
                            catch (error) {
                                return (message.reply("An error occured while running that. Check you mentioned a role."));
                            }
                            message.reply("Succesfully set allowed role to: " + message.mentions.roles.first().name);
                        }
                        setallowedrole();
                        break;
                    // Set the minimum votes required for a votekick to be successful
                    case 'minvotes':
                        async function setminvotes() {
                            let reg = /^\d+$/;
                            if (!reg.test(args[3])) {
                                return (message.reply("An error occured while running that. Check you entered a valid number."))
                            }
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.settings.vkMinVotes';
                            await db.put(keyId, args[3]);
                            message.reply("Succesfully set min votes to: " + args[3]);
                        }
                        setminvotes();
                        break;
                    // A hidden admin command, but allows resetting a users votes back to 0 should an error occur.
                    case 'resetuser':
                        async function resetuservotes() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'voteKick' + '.' + await message.mentions.members.first().id;
                            await db.del(keyId);
                            message.reply("Reset " + message.mentions.members.first().toString() + "'s Votes.");
                        }
                        resetuservotes();
                }

            }
            // If the second arg is get, anyone can execute these.
            else if (args[1].toLowerCase() == "get") {
                // 3rd Arg to lower, and compare
                switch (args[2].toLowerCase()) {
                    // Get the allowed role
                    case 'allowedrole':
                        async function getAllowedRole() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.' + 'settings' + '.' + 'vkAllowedRole';
                            let keyValue = await db.get(keyId);
                            let roleName = await message.guild.roles.resolve(keyValue).name;
                            message.reply(roleName);
                        }
                        try {
                            getAllowedRole();
                        }
                        catch (error) {
                            console.error
                        }
                        break;
                    // Get the minimum votes
                    case 'minvotes':
                        async function getMinVotes() {
                            let serverId = await message.guild.id;
                            let keyId = serverId + '.settings.vkMinVotes';
                            let keyValue = await db.get(keyId);
                            message.reply(keyValue);
                        }
                        getMinVotes();
                        break;
                }
            }
        }
        // Otherwise, if it doesn't match anything else, check if there's a user mention somewhere - if so we are trying to kick that user
        else if (message.mentions.members.first()) {
            async function voteKick() {
                console.log(message.guild.member(message.author).displayName + " tried to votekick.")
                // Initialise variables
                // Vote Array is a list of all users who voted for a user - we count the number of users in it to get total votes
                let serverId = await message.guild.id;
                let keyId = serverId + '.' + 'voteKick' + '.' + message.mentions.members.first().id;
                // Check to see if the keyid exists in the database. If it doesn't this would be the first vote for the user, so initialise it.
                try {
                    let voteArray = [];
                    // Get the current voters from the db - if this fails, skips to the catch
                    let votes = await db.get(keyId);
                    // Just in case, check that votes **does** exist
                    if (votes) {
                        console.log("Vote Array: " + votes)
                        // Deserialise the JSON back into javascript object format
                        let voteArray = await JSON.parse(votes);
                        console.log("Parsed VA: " + voteArray)
                        // If the current author is already in the votearray, they've voted so reject.
                        if (voteArray.includes(message.author.id)) {
                            return (message.reply("Hey no double dipping!"));
                        }
                        // Else this is a new voter; so add their id to the vote array

                        console.log("Voter Passed Check - Adding:");

                        // Add author.id to the voteArray
                        voteArray.push(message.author.id);

                        console.log("Success Added.")
                        // Serialise Vote Array
                        let voteArrayJSON = JSON.stringify(voteArray);
                        // Push vote array into the database
                        try {
                            await db.put(keyId, voteArrayJSON);
                            console.log("Put in DB")
                        }
                        catch(error) {
                            console.log(error);
                        }
                        let minVotesStats = await db.get(serverId + '.settings.vkMinVotes')
                        console.log('Responding in chat.')
                        // Respond back to user
                        message.channel.send("Adding Vote to " + message.mentions.members.first().toString() + "'s Vote Kick (" + voteArray.length + "/" + minVotesStats +")");
                        // Check if voteArray length is larger or equal to min votes, if it is the vote kick is successful.
                        if (voteArray.length >= minVotesStats) {
                            message.channel.send("Vote Kick for " + message.mentions.members.first().toString() + " Succeeded");
                            // Delete user's vote key.
                            await db.del(keyId);
                            if (!TEST_MODE) {
                                await message.mentioned.members.first().kick("Kicked via Successful Vote Kick. Users who voted: " + voteArray);
                                return;
                            }
                            else {
                                console.log("Would Kick")
                                message.channel.send("BOT IS IN TEST MODE. " + message.mentions.members.first().toString() + " WOULDVE HAVE JUST BEEN KICKED.");
                            }
                        }
                        return;

                    }
                }
                catch (err) {
                    if (err.notFound) {
                        // Couldn't find a Key for User - Initiate Vote Kick
                        message.channel.send("Vote Kick For: " + message.mentions.members.first().toString() + " Started by: " + message.author.toString() + "\n.vk " + message.mentions.members.first().toString() + " to vote yes. (1/" + await db.get(serverId + '.settings.vkMinVotes') + ")")
                        // Intialise voteArray
                        let voteArray = [];
                        // Push author id to voteArray
                        await voteArray.push(message.author.id);
                        // Serialise and add to database
                        let voteArrayJSON = await JSON.stringify(voteArray);
                        await db.put(keyId, voteArrayJSON);
                        
                        // Start a timer and then recheck if user has been kicked or not - if not reset user.
                        setTimeout(function () {
                            async function checkVotes() {
                                try {

                                    // User Votekick still exits, expire it
                                    let votes = await db.get(keyId);
                                    if (votes) {
                                        db.del(keyId);
                                        message.channel.send("Vote Kick For: " + message.mentions.members.first().toString() + " expired. (120s)");
                                    }


                                }
                                catch (err) {
                                    if (err.notFound) {

                                    }
                                    else {
                                        console.log(error);
                                    }
                                    
                                }
                            }
                            checkVotes();
                        }, 60000);
                    }
                    else {
                        console.log(err);
                    }
                }
            }
            voteKick();
        }
        // If all else fails; throw a helpful error. 
        else {
            return (message.reply("I didn't get that. Please check .vk help"))
        }
    }
};
