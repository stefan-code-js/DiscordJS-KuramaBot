const { SlashCommandBuilder } = require('@discordjs/builders');
const { Equipment } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('repair')
    .setDescription('Repair a tool for mining, fishing, chopping, or mopping')
    .addStringOption(option => 
      option.setName('item')
        .setDescription('The item to repair (pickaxe, fishingrod, axe, mop)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const item = interaction.options.getString('item').toLowerCase();

    // Fetch the user's equipment
    let equipment = await Equipment.findOne({ where: { userId, type: item } });

    if (!equipment) {
      return interaction.reply({ content: 'You don’t own this item.', ephemeral: true });
    }

    if (equipment.durability === 100) {
      return interaction.reply({ content: `Your **${item}** is already fully repaired!`, ephemeral: true });
    }

    // Repair logic, restoring durability to 100
    equipment.durability = 100;
    await equipment.save();

    return interaction.reply({ content: `Your **${item}** has been fully repaired!`, ephemeral: true });
  }
};
