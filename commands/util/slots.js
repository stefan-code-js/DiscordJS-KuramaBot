const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const crypto = require('crypto');

const emotes = ['🍒', '💎', '🔔', '🍋', '🍉', '🎰'];
const slotsMaxBet = 50000; // Maximum bet for slots

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Roll the slot machine.')
    .addStringOption(option =>
      option.setName('credits')
        .setDescription('The amount of credits to bet (e.g., 50, max 50,000)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const betInput = interaction.options.getString('credits');

    let userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      return interaction.reply({ content: 'You do not have any coins to use the slots.', ephemeral: true });
    }

    let betAmount = parseInt(betInput, 10);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > slotsMaxBet) {
      return interaction.reply({ content: `Please enter a valid bet amount (up to ${slotsMaxBet}).`, ephemeral: true });
    }

    if (betAmount > userProfile.coins) {
      return interaction.reply({ content: `You do not have enough coins to bet ${betAmount}.`, ephemeral: true });
    }

    // Roll the slots using crypto.randomInt()
    const slotRolls = [emotes[crypto.randomInt(0, emotes.length)], emotes[crypto.randomInt(0, emotes.length)], emotes[crypto.randomInt(0, emotes.length)]];

    const slotMessage = `🎰 **${slotRolls[0]} | ${slotRolls[1]} | ${slotRolls[2]}** 🎰`;

    let winnings = 0;

    if (slotRolls[0] === slotRolls[1] && slotRolls[1] === slotRolls[2]) {
      winnings = Math.round(betAmount * (1.5 + (crypto.randomInt(0, 175) / 100))); // Random multiplier
      userProfile.coins += winnings;
      await interaction.reply(`${slotMessage}\n\n💰 **Jackpot! You won ${winnings} coins!**`);
    } else {
      userProfile.coins -= betAmount;
      await interaction.reply(`${slotMessage}\n\n❌ You lost your bet of **${betAmount} coins**.`);
    }

    await userProfile.save();
  },
};
