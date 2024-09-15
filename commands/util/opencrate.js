const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const crateIcons = require('../util/crateIcons'); // Make sure you have crateItems

module.exports = {
  data: new SlashCommandBuilder()
    .setName('opencrate')
    .setDescription('Open a crate using a key'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const userProfile = await Users.findOne({ where: { userId } });

    if (!userProfile) {
      return interaction.reply({ content: 'You do not have a profile yet.', ephemeral: true });
    }

    const inventory = JSON.parse(userProfile.inventory || {});
    if (!inventory.crate || inventory.crate <= 0) {
      return interaction.reply({ content: 'You do not have any crates to open.', ephemeral: true });
    }

    if (!inventory.crateKey || inventory.crateKey <= 0) {
      return interaction.reply({ content: 'You do not have a key to open the crate.', ephemeral: true });
    }

    inventory.crate -= 1;
    inventory.crateKey -= 1;

    // Reward the user (you can customize this reward)
    const rewards = ['gold', 'diamond', 'rare item'];
    const reward = rewards[Math.floor(Math.random() * rewards.length)];

    inventory[reward] = (inventory[reward] || 0) + 1;
    userProfile.inventory = JSON.stringify(inventory);
    await userProfile.save();

    return interaction.reply(`🎉 You opened a crate and found a **${reward}**!`);
  }
};