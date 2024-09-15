const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models'); // Assuming you have a Users model for storing profile data
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your current balance'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const userProfile = await Users.findOne({ where: { userId } });

    if (!userProfile) {
      return interaction.reply('You do not have a profile yet.');
    }

    return interaction.reply(`💰 You have ${userProfile.coins} coins.`);
  },
};