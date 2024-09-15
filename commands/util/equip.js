const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users, Equipment } = require('../../models');
const validItems = { pickaxe: 'pickaxe', rod: 'fishingrod', axe: 'axe', mop: 'mop' };
// Item mapping for flexible matching
const itemMap = {
  pickaxe: 'pickaxe',
  rod: 'fishingrod',
  fishingrod: 'fishingrod',
  axe: 'axe',
  mop: 'mop',
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('equip')
    .setDescription('Equip a tool for mining, fishing, chopping, or mopping')
    .addStringOption(option =>
      option.setName('item')
        .setDescription('The item to equip (pickaxe, rod, axe, mop)')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    let item = interaction.options.getString('item').toLowerCase();

    // Matching input to the correct equipment
    item = Object.keys(validItems).find(valid => item.includes(valid)) || item;

    if (!validItems[item]) {
      return interaction.reply({ content: 'Invalid item specified.', ephemeral: true });
    }

    const userProfile = await Users.findOne({ where: { userId } });
    if (!userProfile) {
      return interaction.reply({ content: 'You need to create a profile first.', ephemeral: true });
    }

    const inventory = JSON.parse(userProfile.inventory || '{}');

    // Check if the user has the item in their inventory
    if (!inventory[item] || inventory[item] <= 0) {
      return interaction.reply({ content: `You do not have a ${item} to equip.`, ephemeral: true });
    }

    // Equip the item if they have it
    let equipment = await Equipment.findOne({ where: { userId, type: item } });
    if (!equipment) {
      equipment = await Equipment.create({
        userId,
        type: item,
        durability: 100, // Initial durability when first equipped
      });
    }

    await interaction.reply(`You have equipped a **${item.charAt(0).toUpperCase() + item.slice(1)}** with ${equipment.durability}% durability.`);
  }
};