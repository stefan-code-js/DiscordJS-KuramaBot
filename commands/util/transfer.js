const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users, TransferLogs } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer items or money to another user')
    .addUserOption(option => option.setName('target').setDescription('User to transfer to').setRequired(true))
    .addStringOption(option => option.setName('type').setDescription('coins or item').setRequired(true))
    .addIntegerOption(option => option.setName('quantity').setDescription('Amount to transfer').setRequired(true)),

  async execute(interaction) {
    const targetUser = interaction.options.getUser('target');
    const transferType = interaction.options.getString('type');
    const quantity = interaction.options.getInteger('quantity');
    const userProfile = await Users.findOne({ where: { userId: interaction.user.id } });
    const targetProfile = await Users.findOne({ where: { userId: targetUser.id } });

    if (!targetProfile) {
      return interaction.reply('The target user doesn\'t have a profile.');
    }

    if (transferType === 'coins' && userProfile.coins >= quantity) {
      userProfile.coins -= quantity;
      targetProfile.coins += quantity;

      await userProfile.save();
      await targetProfile.save();

      await TransferLogs.create({
        fromUserId: interaction.user.id,
        toUserId: targetUser.id,
        itemType: 'coins',
        quantity: quantity,
      });

      return interaction.reply(`You transferred **${quantity} coins** to ${targetUser.username}.`);
    } else {
      return interaction.reply('Insufficient balance or invalid transfer type.');
    }
  },
};