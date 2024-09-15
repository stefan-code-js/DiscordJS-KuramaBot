const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('use')
    .setDescription('Use a potion')
    .addStringOption(option =>
      option.setName('potion')
        .setDescription('The potion you want to use')
        .setRequired(true)),

  async execute(interaction) {
    const userProfile = await Users.findOne({ where: { userId: interaction.user.id } });
    const potion = interaction.options.getString('potion').toLowerCase();

    if (!userProfile.potions[potion] || userProfile.potions[potion] <= 0) {
      return interaction.reply('❌ You don\'t have this potion.');
    }

    userProfile.potions[potion] -= 1;

    if (potion === 'miningPotion') {
      userProfile.miningBuff = true; // Add a field to track potion effects
      await userProfile.save();
      return interaction.reply('⛏️ You used a Mining Potion! Your mining abilities are enhanced for the next session.');
    }

    if (potion === 'fishingPotion') {
      userProfile.fishingBuff = true;
      await userProfile.save();
      return interaction.reply('🎣 You used a Fishing Potion! Your fishing abilities are enhanced for the next session.');
    }

    return interaction.reply('❌ This potion cannot be used.');
  }
};
