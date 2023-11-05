const { randomInt } = require("crypto");
const {
  staffRoleId,
  rumbleChannelId,
  rumblePingId,
  rumbleInstructions,
  deathOptions,
  endDeathOptions,
} = require("../../config.js");

const { EmbedBuilder } = require("discord.js");

seconds = 30;

const instruction_embed = new EmbedBuilder()
  .setTitle("You have successfully joined the team rumble in Madfutters!")
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

module.exports = {
  name: "messageCreate",
  once: true,
  logName: "team rumble",
  async execute(client, message) {
    // Check if the message starts with the command
    if (!message.content.startsWith("!team-rumble")) return;
    if (client.rumble.isActive === true)
      return message.author.send(
        `There is already a rumble happening. Please wait.`
      );

    // Check if the member who ran the command possesses the staff role.
    const member = message.member;
    if (!member.roles.cache.has(staffRoleId)) {
      return message.author.send({
        content: `Invalid Permissions.`,
      });
    }

    // Check if the command was sent in the correct channel.
    if (message.channel.id !== rumbleChannelId) {
      return message.author.send({
        content: `To run this command go to <#${rumbleChannelId}> .`,
      });
    }

    client.rumble = {
      isActive: false,
      members: [],
      userNames: [],
    };

    client.teams = {};

    message.delete();
    const rumbleMessage = await message.channel.send({
      embeds: [rumbleEmbed(30)],
    });
    const ping = await message.channel.send(`<@&${rumblePingId}>`);
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
        console.log(client.rumble.members, "\n", client.rumble.members.length);
        // Check the number of members in the array
        if (client.rumble.members.length < 2) {
          rumbleMessage.delete;
          message.channel.send(
            "Cannot start a team rumble with less than 2 members."
          );
          rumbleMessage.edit();
          console.log(
            `Rumble cancelled as only ${client.rumble.members.length} members.`
          );
          return;
        } else {
          client.rumble.isActive = true; // Set the rumble to true!

          rumbleMessage.edit({
            embeds: [startingRumble_embed],
          });

          message.channel.send(
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
            await message.channel.send(
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

          message.channel.send(`All teams have been created, game commencing.`);
          console.log(client.teams);

          if (client.teams.length < 2) {
            message.channel.send(`Cannot start a game with only 2 teams.`);
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
              message.channel.send(
                `<@${t1_p1}> & ${t1_p2} ${death} <@${t2_p1}> & <@${t2_p2}>`
              );
            }, 1500);
            message.channel.send(
              `Team ${t1_index} has been killed. They are not longer in the game.`
            );

            client.teams.splice(t1_index, 1);
          }

          const teamObject = Object.values(client.teams)[0];

          if (teamObject) {
            // Access the value of the object
            const [winning_p1, winning_p2] = teamObject.split(" & ");

            // Send messages with the values
            await message.channel.send(
              `The winners are <@${winning_p1}> and <@${winning_p2}> , but wait, they've fallen out. OMG...`
            );
            setTimeout(() => {
              message.channel.send(`In a serious of unfortunate events... `);
            }, 3000);
            const endDeath =
              endDeathOptions[randomInt(0, endDeathOptions.length)];
            setTimeout(() => {
              message.channel.send(
                `<@${winning_p2}>${endDeath}<@${winning_p1}>`
              );
            }, 5000);
            client.rumble.isActive = false;
            seconds = 30;
            // Code here to check if they are actually linked!
            linked = randomInt(-50, 150); // Will obv be true or false but just makes my code work 50% of the time to show both messages ;)

            if (linked > 50) {
              setTimeout(() => {
                message.channel.send(
                  `<@${winning_p1}> has won! Check your madfut trades now!`
                );
                console.log(linked);
              }, 6500);

              // Code to send bots to them here...
            } else {
              setTimeout(() => {
                message.channel.send(
                  `<@${winning_p1}> has won! But... Tut, tut tut. You aren't linked. What a donut, you will receive nothing for winning this time round!`
                );
                console.log(linked);
              }, 6500);
            }
          } else {
            message.channel.send("No team data found.");
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
  },
};
