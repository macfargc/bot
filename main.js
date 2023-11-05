const {
  Client,
  IntentsBitField,
  ActivityType,
  Partials,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const { token, serverInviteUrl, deathOptions } = require("../config");
const fs = require("fs");
const path = require("node:path");
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Reaction,
    Partials.User,
  ],
});

client.bullying = {
  isActive: false,
  bullyInterval: null,
};
client.rumble = {
  isActive: false,
  members: [],
  userNames: [],
  deathOptions: deathOptions,
};

client.teams = {};

client.on("ready", () => {
  try {
    console.log(`Bot online!`);

    client.user.setActivity({
      name: `${serverInviteUrl.split("https://discord.gg/")[1]}`,
      type: ActivityType.Watching,
    });
  } catch (error) {
    console.error(error);
    exit();
  }
});

// Load event files
const eventFiles = fs
  .readdirSync("C:/Users/macfa/Desktop/madfutters/src/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`C:/Users/macfa/Desktop/madfutters/src/events/${file}`);

  if (event.name) {
    client.on(event.name, event.execute.bind(null, client));
    console.log(`Loaded event: ${event.logName}`);
  }
}

client.login(token);
