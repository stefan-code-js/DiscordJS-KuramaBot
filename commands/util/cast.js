const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cast')
    .setDescription('Craft new items from materials')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('The item you want to craft')
        .setRequired(true)),

  async execute(interaction) {
    const userProfile = await Users.findOne({ where: { userId: interaction.user.id } });
    const itemToCraft = interaction.options.getString('item').toLowerCase();

    if (itemToCraft === 'firepickaxe') {
      if (!userProfile.purchasedItems['pickaxe'] || !userProfile.purchasedItems['fireShard']) {
        return interaction.reply('❌ You need both a Pickaxe and a Fire Shard to craft a Fire Pickaxe.');
      }

      userProfile.purchasedItems['pickaxe'] -= 1;
      userProfile.purchasedItems['fireShard'] -= 1;
      userProfile.purchasedItems['firepickaxe'] = (userProfile.purchasedItems['firepickaxe'] || 0) + 1;

      await userProfile.save();
      return interaction.reply('🔥 You have successfully crafted a Fire Pickaxe!');
    }

    return interaction.reply('❌ This item cannot be crafted.');
  }
};
