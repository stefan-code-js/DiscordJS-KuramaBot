const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models'); // Assuming you have a Users model for storing profile data
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current balance'),

  async execute(interaction) {
    // Fetch or create the user's profile
    let userProfile = await Users.findOne({ where: { userId: interaction.user.id } });

    if (!userProfile) {
      return interaction.reply({ content: 'You don\'t have a balance yet. Try earning some coins by mining or fishing!', ephemeral: true });
    }

    const balanceMessage = `
💰 **Your Balance**:

**Coins**: ${userProfile.coins.toLocaleString()} coins

Earn more coins by participating in activities like mining or fishing!
    `;

    await interaction.reply(balanceMessage);
  }
};