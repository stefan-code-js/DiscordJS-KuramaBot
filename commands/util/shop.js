const { SlashCommandBuilder } = require('@discordjs/builders');
const shopItems = require('../util/shopItems'); // Updated shopItems

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse and manage the shop')
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('The item to buy')
            .setRequired(true)
            .addChoices(
              ...Object.keys(shopItems).map(key => ({
                name: shopItems[key].name,
                value: key
              }))
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('sell')
        .setDescription('Sell an item from your inventory')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('The item to sell')
            .setRequired(true)
            .addChoices(
              ...Object.keys(shopItems).map(key => ({
                name: shopItems[key].name,
                value: key
              }))
            )
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View all available items in the shop')
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'buy') {
      const itemKey = interaction.options.getString('item');
      const selectedItem = shopItems[itemKey];

      // Add your buy logic here
      return interaction.reply(`You chose to buy **${selectedItem.name}**.`);
    }

    if (subcommand === 'sell') {
      const itemKey = interaction.options.getString('item');
      const selectedItem = shopItems[itemKey];

      // Add your sell logic here
      return interaction.reply(`You chose to sell **${selectedItem.name}**.`);
    }

    if (subcommand === 'view') {
      const shopItemsDisplay = Object.entries(shopItems)
        .map(([key, item]) => `${item.name} - ${item.price} coins`)
        .join('\n');

      return interaction.reply(`🛒 **Shop Items:**\n${shopItemsDisplay}`);
    }
  }
};
