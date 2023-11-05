const config = {
  token: "",
  clientId: "1165682149849047050",
  guildId: "1165682275061604432",
  serverInviteUrl: "https://discord.gg/madfutters",
  staffRoleId: "1167252389439479818",
  rumbleChannelId: "1167116066724528158",
  rumblePingId: "1167252389439479818",
  rumbleInstructions: `You have joined a rumble, all you have to do is wait and hope that you win and you will receive bot trades. \n If you win you will get in a message sent by the bot in the same channel the rumble was started in where it will say your name and that you have received bot trades. Then all you need to do is: \n• Go to your phone \n• Open up madfut \n• Go to trading put 3 cards on your wishlist \n• Then accept the invite from our bot.`,
  deathOptions: [
    // No suicide please as you will have to edit the code to check if the suicide one was selected and if so then only remove the first player.
    // Set it up like this: " was killed by " have a space before where player 1 will be inserted and a space after where player 2 will be inserted.
    ` got double killed by `,
    ` got stabbed by `,
    ` got drunk and got whacked on the head by  `,
    ` was double pumped by `,
  ],
  endDeathOptions: [
    ` jumped off a bridge after learning that their girlfriend cheated on them with `,
  ],
};

module.exports = config;
