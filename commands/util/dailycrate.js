const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dailycrate')
    .setDescription('Claim your daily crate'),

  async execute(interaction) {
    const userId = interaction.user.id;
    let userProfile = await Users.findOne({ where: { userId } });

    if (!userProfile) {
      return interaction.reply({ content: 'You need to create a profile first.', ephemeral: true });
    }

    const now = Date.now();
    const lastClaimed = userProfile.lastClaimed || 0;
    const timePassed = now - lastClaimed;
    const cooldown = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (timePassed < cooldown) {
      const remainingTime = cooldown - timePassed;
      return interaction.reply(`You need to wait ${Math.floor(remainingTime / 1000 / 60)} minutes before claiming your next crate.`);
    }

    // Update the last claimed timestamp and reward the crate
    userProfile.lastClaimed = now;
    userProfile.crates += 1; // or however crates are managed
    await userProfile.save();

    interaction.reply('You have claimed your daily crate! 🎁');
  }
};
