const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const crypto = require('crypto');

const gambleLimit = 10000; // Maximum gamble amount

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gamble')
    .setDescription('Gamble your coins away.')
    .addStringOption(option =>
      option.setName('amount')
        .setDescription('The amount to gamble (e.g., all, half, quarter, or a specific number)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amountInput = interaction.options.getString('amount').toLowerCase();

    let userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      return interaction.reply({ content: 'You do not have any coins to gamble.', ephemeral: true });
    }

    let gambleAmount;
    const coins = userProfile.coins;

    // Determine gamble amount based on input
    if (amountInput === 'all') {
      gambleAmount = coins;
    } else if (amountInput === 'half') {
      gambleAmount = Math.floor(coins / 2);
    } else if (amountInput === 'quarter') {
      gambleAmount = Math.floor(coins / 4);
    } else {
      gambleAmount = parseInt(amountInput, 10);
      if (isNaN(gambleAmount) || gambleAmount <= 0) {
        return interaction.reply({ content: 'Invalid amount entered.', ephemeral: true });
      }
    }

    if (gambleAmount > coins || gambleAmount > gambleLimit) {
      return interaction.reply({ content: `You can only gamble up to ${gambleLimit} coins or the amount you have.`, ephemeral: true });
    }

    if (gambleAmount <= 0) {
      return interaction.reply({ content: 'You need to gamble a valid amount.', ephemeral: true });
    }

    // Roll for the result
    const winMultiplier = 1.3 + (crypto.randomInt(0, 135) / 100); // Random number between 1.3 and 2.65
    const luck = crypto.randomInt(0, 100); // Random number between 0 and 100

    let winnings;
    if (luck > 50) {
      winnings = Math.round(gambleAmount * winMultiplier);
      userProfile.coins += winnings;
      await interaction.reply(`🎲 You gambled **${gambleAmount} coins** and won **${winnings} coins**!`);
    } else {
      userProfile.coins -= gambleAmount;
      await interaction.reply(`🎲 You gambled **${gambleAmount} coins** and lost everything!`);
    }

    await userProfile.save();
  },
};
