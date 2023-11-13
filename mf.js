const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { guildLogo, staffRoleId } = require("../../../config.js");
const fs = require("fs");
const { formatDistanceToNow } = require("date-fns");
const { error } = require("console");
const rewards = [];
const ids = [];
let bts = 0;

function randomNum(max) {
  return Math.floor(Math.random() * max);
}

const botTrades = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mf")
    .setDescription("Main command with subcommands")
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("admin")
        .setDescription("Admin Commands")
        .addSubcommand((subcommand) =>
          subcommand.setName("megabox").setDescription("A megabox for admins.")
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("random-player")
            .setDescription("Get a random player")
            .addNumberOption((option) =>
              option
                .setName("min_rating")
                .setDescription("Minimum rating")
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName(`team-rumble`)
            .setDescription(
              `Start a team rumble in the same channel you are in right now.`
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName(`gtp`)
            .setDescription(`Guess the player for 1m coins.`)
        )
    ),

  async execute(client, interaction) {
    const { commandName, options, user } = interaction;

    const staffRole = client.guilds.cache
      .get(interaction.guild.id)
      .roles.cache.get(staffRoleId);

    if (!interaction.member.roles.cache.has(staffRole.id)) return;

    // Handle the main 'mf' command and its subcommands
    const subcommand = options.getSubcommand();
    try {
      if (subcommand === "megabox") {
        const userId = user.id;
        if (client.megaBox.usersUsing.includes(userId)) {
          const lastUsedTime = client.megaBox.lastUsedTimes[userId];
          const timeSinceLastUsed = formatDistanceToNow(
            new Date(lastUsedTime),
            {
              addSuffix: true,
            }
          );

          // If the time since last use is greater than or equal to 24 hours
          if (
            timeSinceLastUsed.includes("day") ||
            timeSinceLastUsed.includes("days")
          ) {
            // Remove the user's entry from lastUsedTimes
            delete client.megaBox.lastUsedTimes[userId];
          } else {
            // The user has used the megabox recently
            interaction.reply({
              content: `You already used the megabox ${timeSinceLastUsed}.`,
              ephemeral: true,
            });
            return;
          }
        }
        interaction.reply({
          content: `Opening a box now!!!`,
          ephemeral: true,
        });
        // Check if the user's ID is in client.megaBox.usersUsing

        async function getRandomPlayer(minRating) {
          if (minRating > 99 || minRating < 64) {
            return null; // Return null or an appropriate value for an invalid rating
          }

          // Read the JSON file
          const rawData = fs.readFileSync(
            `C:/Users/macfa/Desktop/madfutters/players.json`
          );
          const playersData = JSON.parse(rawData);

          while (true) {
            // Filter players with a rating of 90 or above
            const ratedPlayers = playersData.filter(
              (player) => player.rating >= minRating
            );

            // Check if there are any high-rated players
            if (ratedPlayers.length > 0) {
              // Generate a random index for high-rated players
              const randomIndex = Math.floor(
                Math.random() * ratedPlayers.length
              );

              // Get the high-rated player at the random index
              const randomPlayer = ratedPlayers[randomIndex];

              // Check if the player is already in the rewards array
              if (
                !client.megaBox.rewards.some((reward) =>
                  reward.includes(randomPlayer.id)
                )
              ) {
                // Extract name and rating from the random high-rated player
                const playerName = randomPlayer.name;
                const playerRating = randomPlayer.rating;
                client.megaBox.toldRewards.push(
                  `\n ${playerRating} - ${playerName}`
                );
                client.megaBox.rewards.push(
                  ` ${playerRating} - ${playerName} `
                );
                ids.push(randomPlayer.id); // Push the player's id here.
                break; // Exit the loop if a unique player is added to the rewards array
              }
            }
          }
        }

        // Code here if wanted to check if the user actually has a megabox in the wallet...
        // If the user has used the command before

        // The user is using the megabox command for the first time
        // Your logic for handling the megabox command goes here

        // Update lastUsedTime for the user
        client.megaBox.lastUsedTimes[userId] = new Date();

        // Add the user's ID to the list of users using the megabox
        client.megaBox.usersUsing.push(userId);
        while (client.megaBox.rewards.length !== 90) {
          await getRandomPlayer(85);
        }

        console.log(
          `${interaction.user.tag} has opened a megabox and is now receiving all his rewards.`
        );

        let bts = botTrades[randomNum(10)];

        while (bts < 1) {
          let bts = botTrades[randomNum(10)];
          return bts;
        }

        // Assuming client.megaBox.rewards is an array like:
        // ["94 - Ronaldo", "92 - Müller", ...]

        // Parse the array and convert it to an array of objects
        const rewardsArray = client.megaBox.rewards.map((reward) => {
          const [rating, name] = reward.split(" - ");
          return { rating: parseInt(rating), name };
        });

        // Sort the array in descending order based on rating
        rewardsArray.sort((a, b) => b.rating - a.rating);

        // Convert the sorted array back to the original format
        const sortedRewards = rewardsArray
          .map((reward) => ` ${reward.rating} - ${reward.name}`)
          .join(",");

        // Now, sortedRewards contains the array sorted in descending order by rating with a space before each rating and a comma between elements
        console.log(sortedRewards);

        // Now, sortedRewards contains the array sorted in descending order by rating

        const embed = new EmbedBuilder()
          .setTitle(`${interaction.user.tag} here are your rewards!!!`)
          .setDescription(
            `${sortedRewards}` + `\n ${botTrades[randomNum(10)]} bot trades.`
          )
          .setColor(`Blue`)
          .setFooter({
            text: `discord.gg/madfutters - megabox !!!`,
            iconURL: `https://media.discordapp.net/attachments/1165688227714302084/1172671103332794398/logo.png?ex=65612a12&is=654eb512&hm=12c2db5892541426180b51bb52d0d00fa5d3a8c79346780d9892b16ca358ae51&=&width=701&height=701`,
          });

        setTimeout(() => {
          interaction.channel.send(
            `These rewards are looking decent ngl, you should be looking forward to what your about to get! 😉`
          );
        }, 2500);
        setTimeout(() => {
          interaction.channel.send({
            embeds: [embed],
          });
        }, 5000);
        //interaction.reply(`Here are your rewards: ${rewards}, \n ${bts}`);

        // Code here to update the user's wallet with all the players (by their ids) from the ids array and add the bot trades from the bts variable.

        client.megaBox.rewards = [];
        // Code to add 10 bot trades alongside all the players by their ids to the user's wallet.
      } else if (subcommand === "random-player") {
        // Your logic for the rand-player subcommand
        console.log(`${interaction.user.tag} has generated a random player.`);
        const minRating = interaction.options.getNumber("min_rating");

        if (minRating > 99 || minRating < 64)
          return interaction.reply({
            content: `Cannot get a player with the rating ${minRating} as there is a range of 64 - 99. Try again.`,
            ephemeral: true,
          });

        // Read the JSON file
        const rawData = fs.readFileSync(
          `C:/Users/macfa/Desktop/madfutters/players.json`
        );
        const playersData = JSON.parse(rawData);

        // Filter players with a rating of 90 or above
        const ratedPlayers = playersData.filter(
          (player) => player.rating >= minRating
        );

        // Check if there are any high-rated players
        if (ratedPlayers.length > 0) {
          // Generate a random index for high-rated players
          const randomIndex = Math.floor(Math.random() * ratedPlayers.length);

          // Get the high-rated player at the random index
          const randomPlayer = ratedPlayers[randomIndex];

          // Extract name, rating, and image link from the random high-rated player
          const playerName = randomPlayer.name.split(",")[0];
          const playerRating = String(randomPlayer.rating).split(",")[0];

          // Log the randomly selected high-rated player's data
          interaction.reply({
            content: `${playerRating}, ${playerName}, `, // Add the image link as a file attachment
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: `No players found...`,
            ephemeral: true,
          });
        }
      } else if (subcommand === "team-rumble") {
        interaction.reply({
          content: `Starting rumble joiner now...`,
          ephemeral: true,
        });

        const { randomInt } = require("crypto");
        const {
          rumbleChannelId,
          rumblePingId,
          rumbleInstructions,
          deathOptions,
          endDeathOptions,
        } = require("../../../../config.js");

        seconds = 30;

        const instruction_embed = new EmbedBuilder()
          .setTitle(
            "You have successfully joined the team rumble in Madfutters!"
          )
          .setDescription(
            `Below is a list of instructions for you to be able to follow to get the most out of 
    the rumble experience: \n \n ${rumbleInstructions}`
          )
          .setColor("Blue");

        const startingRumble_embed = new EmbedBuilder()
          .setTitle(`Rumble is now starting!`)
          .setColor("Green");
        function rumbleEmbed(seconds) {
          return new EmbedBuilder()
            .setTitle(`A rumble will start in: ${seconds} seconds.`)
            .setDescription(`React below to join!`)
            .setColor("Blurple");
        }
        client.rumble = {
          isActive: false,
          members: [],
          userNames: [],
        };

        client.teams = {};

        const rumbleMessage = await interaction.channel.send({
          embeds: [rumbleEmbed(30)],
        });
        const ping = await interaction.channel.send(`<@&${rumblePingId}>`);
        ping.delete();
        console.log(`Deleted the ping.`);

        //const rumbleMessage = await message.channel.send(
        //  `@here - A team rumble will start in **${seconds}** seconds.`
        //);
        rumbleMessage.react("⚔️");
        const interval = setInterval(async () => {
          seconds -= 1;
          rumbleMessage.edit({
            embeds: [rumbleEmbed(seconds)],
          });

          if (seconds === 0) {
            clearInterval(interval);
            console.log(
              client.rumble.members,
              "\n",
              client.rumble.members.length
            );
            // Check the number of members in the array
            if (client.rumble.members.length < 2) {
              rumbleMessage.delete;
              interaction.channel.send(
                "Cannot start a team rumble with less than 2 members."
              );
              rumbleMessage.delete();
              console.log(
                `Rumble cancelled as only ${client.rumble.members.length} members.`
              );
              return;
            } else {
              client.rumble.isActive = true; // Set the rumble to true!

              rumbleMessage.edit({
                embeds: [startingRumble_embed],
              });

              interaction.channel.send(
                `**Here are all the members in this rumble:** ${client.rumble.userNames} `
              );

              numOfPlayers = client.rumble.members.length;
              if (numOfPlayers % 2 !== 0) {
                const randomIndex = randomInt(0, client.rumble.members.length);
                const randomUserToRemove = client.rumble.members[randomIndex];

                client.rumble.members.splice(randomIndex, 1); // Remove the user from the array

                message.channel.send(
                  `<@${randomUserToRemove}> has been removed as there was an uneven amount of players in this game.`
                );
              }
              team = 0;
              while (client.rumble.members.length >= 2) {
                // Check if there are at least 2 members left
                console.log(
                  `There are ${client.rumble.members.length} members still to be put in a team.`
                );
                team++;
                const p1_index = randomInt(0, client.rumble.members.length);
                let p2_index = randomInt(0, client.rumble.members.length);

                while (p2_index === p1_index) {
                  p2_index = randomInt(0, client.rumble.members.length);
                }
                // Create a new team object with the two members
                client.teams[
                  team
                ] = `${client.rumble.members[p1_index]} & ${client.rumble.members[p2_index]}`;
                console.log(client.teams[team]);

                // Send a message to the channel with the team information
                await interaction.channel.send(
                  `Team${team}: <@${client.rumble.members[p1_index]}> and <@${client.rumble.members[p2_index]}>`
                );
                console.log(`Team created.`);

                // Remove p1 and p2 from client.rumble.members by their index
                client.rumble.members.splice(p1_index, 1);
                client.rumble.members.splice(
                  p2_index > p1_index ? p2_index - 1 : p2_index,
                  1
                );
              }

              console.log(`Removed players that were put in a team.`);

              interaction.channel.send(
                `All teams have been created, game commencing.`
              );
              console.log(client.teams);

              if (client.teams.length < 2) {
                interaction.channel.send(
                  `Cannot start a game with only 2 teams.`
                );
                console.log(`\n Game exited as there was only one team.`);
              }

              while (client.teams.length > 1) {
                death = deathOptions[randomInt(0, deathOptions.length)];

                const t1_index = randomInt(0, client.rumble.members.length);
                let t2_index = randomInt(0, client.rumble.members.length);

                while (t2_index === t1_index) {
                  t2_index = randomInt(0, client.rumble.members.length);
                }

                const team1 = client.teams[t1_index];

                const t1_p1 = team1.split(" & ")[0];
                const t1_p2 = team1.split(" & ")[1];

                const team2 = client.teams[t1_index];

                const t2_p1 = team2.split(" & ")[0];
                const t2_p2 = team2.split(" & ")[1];

                setTimeout(() => {
                  interaction.channel.send(
                    `<@${t1_p1}> & ${t1_p2} ${death} <@${t2_p1}> & <@${t2_p2}>`
                  );
                }, 1500);
                interaction.channel.send(
                  `Team ${t1_index} has been killed. They are not longer in the game.`
                );

                client.teams.splice(t1_index, 1);
              }

              const teamObject = Object.values(client.teams)[0];

              if (teamObject) {
                // Access the value of the object
                const [winning_p1, winning_p2] = teamObject.split(" & ");

                // Send messages with the values
                await interaction.channel.send(
                  `The winners are <@${winning_p1}> and <@${winning_p2}> , but wait, they've fallen out. OMG...`
                );
                setTimeout(() => {
                  interaction.channel.send(
                    `In a serious of unfortunate events... `
                  );
                }, 3000);
                const endDeath =
                  endDeathOptions[randomInt(0, endDeathOptions.length)];
                setTimeout(() => {
                  interaction.channel.send(
                    `<@${winning_p2}>${endDeath}<@${winning_p1}>`
                  );
                }, 5000);
                client.rumble.isActive = false;
                seconds = 30;
                // Code here to check if they are actually linked!
                linked = randomInt(-50, 150); // Will obv be true or false but just makes my code work 50% of the time to show both messages ;)

                if (linked > 50) {
                  setTimeout(() => {
                    interaction.channel.send(
                      `<@${winning_p1}> has won! Check your madfut trades now!`
                    );
                    console.log(linked);
                  }, 6500);

                  // Code to send bots to them here...
                } else {
                  setTimeout(() => {
                    interaction.channel.send(
                      `<@${winning_p1}> has won! But... Tut, tut tut. You aren't linked. What a donut, you will receive nothing for winning this time round!`
                    );
                    console.log(linked);
                  }, 6500);
                }
              } else {
                interaction.channel.send("No team data found.");
              }
            }
          }
        }, 1 * 1000);

        // Reaction listener
        // Reaction listener
        const filter = (reaction, user) => reaction.emoji.name === "⚔️";
        const collector = rumbleMessage.createReactionCollector({
          filter,
          time: seconds * 1000, // Listen for reactions for the number of seconds it takes for the game to start.
        });

        // Initialize client.rumble outside the event handler
        collector.on("collect", (reaction, user) => {
          // Check if the reaction user is not a bot
          if (user.bot) return;

          console.log(`User ${user.tag} reacted with ⚔️`);

          // Update client.rumble by pushing data
          client.rumble.members.push(user.id);
          console.log(`\nAdded their id to the list.`);

          client.rumble.userNames.push(` ${user.tag}`);
          console.log(`\nAdded their username to the list.`);
          try {
            //user.send({ embeds: [instruction_embed] });
            //console.log(`\nInstructions sent to their dms.`);
          } catch (error) {
            //console.log(`Didn't send instructions as player has dms off.`);
          }
        });
      } else if (subcommand === "gtp") {
        const rawData = fs.readFileSync(
          "C:/Users/macfa/Desktop/madfutters/players.json"
        );
        const playersData = JSON.parse(rawData);

        const minRating = 80; // Set your minimum rating here
        const ratedPlayers = playersData.filter(
          (player) => player.rating >= 85
        );

        // Check if there are any high-rated players
        if (ratedPlayers.length > 0) {
          // Generate a random index for high-rated players
          const randomIndex = Math.floor(Math.random() * ratedPlayers.length);

          // Get the high-rated player at the random index
          const randomPlayer = ratedPlayers[randomIndex];

          // Extract name, rating, and image link from the random high-rated player
          const playerName = String(randomPlayer.name)
            .split(",")[0]
            .toLowerCase();
          const playerRating = String(randomPlayer.rating).split(",")[0];
          const playerNation = String(randomPlayer.nation.name).split(",")[0];
          const playerClub = String(randomPlayer.club.name).split(",")[0];
          const playerPos = String(randomPlayer.position).split(",")[0];

          const special_a = ["á", "à", "ä"];
          const special_e = ["é", "è", "ê", "ë"];
          const special_i = ["í", "î", "ï"];
          const special_o = ["ó", "ô", "ö"];
          const special_u = ["ú", "û", "ü"];

          while (
            special_a.some((char) => playerName.includes(char)) ||
            special_e.some((char) => playerName.includes(char)) ||
            special_i.some((char) => playerName.includes(char)) ||
            special_o.some((char) => playerName.includes(char)) ||
            special_u.some((char) => playerName.includes(char))
          ) {
            // Replace special characters with their corresponding basic letters
            special_a.forEach((char) => {
              playerName = playerName.replace(new RegExp(char, "g"), "a");
            });

            special_e.forEach((char) => {
              playerName = playerName.replace(new RegExp(char, "g"), "e");
            });

            special_i.forEach((char) => {
              playerName = playerName.replace(new RegExp(char, "g"), "i");
            });

            special_o.forEach((char) => {
              playerName = playerName.replace(new RegExp(char, "g"), "o");
            });

            special_u.forEach((char) => {
              playerName = playerName.replace(new RegExp(char, "g"), "u");
            });
          }

          // Your code here after replacing special characters in playerName

          // Use EmbedBuilder for creating the embed
          const embed = new EmbedBuilder()
            .setTitle("Random Player Details")
            .addFields(
              {
                name: "Player Name Starts With",
                value: playerName.substring(0, 3),
              }, // Display only the first letter
              { name: "Position", value: playerPos },
              { name: "Rating", value: playerRating },
              { name: "Nation", value: playerNation },
              { name: "Club", value: playerClub }
            )
            .setColor(`Blue`);

          await interaction.reply({ embeds: [embed] });

          // Allow multiple guesses
          let allowedGuesses = 3; // Set the number of allowed guesses
          let correctGuess = false;

          while (allowedGuesses > 0 && !correctGuess) {
            // Wait for a message from the user
            const filter = (msg) => msg.author.id === interaction.user.id;
            const response = await interaction.channel.awaitMessages({
              filter,
              max: 1,
              time: 60 * 2 * 1000,
            });

            if (response.size === 0) {
              // No response received
              await interaction.followUp(
                "You didn't provide an answer within the time limit."
              );
            } else {
              // Check if the user's response includes the player's name
              const userAnswer = response.first().content.toLowerCase();
              if (userAnswer.includes(playerName)) {
                await interaction.followUp(
                  "Correct! You have received 1m coins."
                );
                correctGuess = true;
                // Code to update wallet here
              } else {
                await interaction.followUp("Incorrect answer. Try again.");
                allowedGuesses--;
              }
            }
          }

          if (!correctGuess) {
            await interaction.followUp(
              `You've used all your guesses. The correct answer was ${playerName}.`
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  },
};
