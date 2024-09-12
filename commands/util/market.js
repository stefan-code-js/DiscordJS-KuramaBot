const { SlashCommandBuilder } = require('@discordjs/builders');
const { Users } = require('../../models');
const shopItems = {
  pickaxe: { name: 'Pickaxe', price: 100 },
  fishingrod: { name: 'Fishing Rod', price: 150 }, // Added Fishing Rod
  xe: { name: 'Axe', price: 120 } // New Axe added
};
const { prefix } = require('../../config.json');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('market')
    .setDescription('market commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View items in the shop'))
    .addSubcommand(subcommand =>
      subcommand
        .setName('buy')
        .setDescription('Buy an item from the shop')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('The item to buy')
            .setRequired(true)
            .addChoices(
              { name: 'Pickaxe', value: 'pickaxe' },
              { name: 'Fishing Rod', value: 'fishingrod' } // Added fishing rod as an option
            ))
        .addIntegerOption(option =>
          option.setName('quantity')
            .setDescription('Quantity to buy')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('sell')
        .setDescription('Sell an item from your inventory')
        .addStringOption(option =>
          option.setName('item')
            .setDescription('The item to sell')
            .setRequired(true)
            .addChoices(
              { name: 'Pickaxe', value: 'pickaxe' },
              { name: 'Fishing Rod', value: 'fishingrod' } // Added fishing rod as an option
            ))
        .addIntegerOption(option =>
          option.setName('quantity')
            .setDescription('Quantity to sell')
            .setRequired(true))),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    let userProfile = await Users.findOne({ where: { userId } });

    if (!userProfile) {
      return interaction.reply({ content: 'You need to create a profile first.', ephemeral: true });
    }

    // Parse user's inventory
    let inventory = JSON.parse(userProfile.inventory || '{}');

    // Handle the view subcommand
    if (subcommand === 'view') {
      const itemsInShop = Object.keys(shopItems)
        .map(item => `**${shopItems[item].name}** - ${shopItems[item].price} credits`)
        .join('\n');

      return interaction.reply({ content: `Items in the shop:\n\n${itemsInShop}`, ephemeral: true });
    }

    // Handle the buy subcommand
    if (subcommand === 'buy') {
      const itemToBuy = interaction.options.getString('item').toLowerCase(); // Normalize to lowercase
      const quantityToBuy = interaction.options.getInteger('quantity');
      
      if (!shopItems[itemToBuy]) {
        return interaction.reply({ content: 'This item is not available in the shop.', ephemeral: true });
      }

      const totalCost = shopItems[itemToBuy].price * quantityToBuy;
      
      // Check if the user has enough credits
      if (userProfile.coins < totalCost) {
        return interaction.reply({ content: `You don't have enough credits to buy ${quantityToBuy} ${itemToBuy}(s).`, ephemeral: true });
      }

      // Deduct the cost from the user's credits
      userProfile.coins -= totalCost;

      // Add the item to the user's inventory
      if (inventory[itemToBuy]) {
        inventory[itemToBuy].count += quantityToBuy;
      } else {
        inventory[itemToBuy] = { count: quantityToBuy, durability: 170 }; // Default durability for items
      }

      // Save the updated user profile
      userProfile.inventory = JSON.stringify(inventory);
      await userProfile.save();

      return interaction.reply({ content: `You bought ${quantityToBuy} ${itemToBuy}(s) for ${totalCost} credits.`, ephemeral: true });
    }

    // Handle the sell subcommand
    if (subcommand === 'sell') {
      const itemToSell = interaction.options.getString('item').toLowerCase(); // Normalize to lowercase
      const quantityToSell = interaction.options.getInteger('quantity');

      // Check if the item exists in the inventory
      const inventoryItem = inventory[itemToSell];
      if (!inventoryItem || inventoryItem.count < quantityToSell) {
        return interaction.reply({ content: `You don't have enough ${itemToSell}(s) to sell.`, ephemeral: true });
      }

      // Sell the item
      if (shopItems[itemToSell]) {
        inventoryItem.count -= quantityToSell;
        if (inventoryItem.count === 0) {
          delete inventory[itemToSell]; // Remove item from inventory if count reaches 0
        }

        // Add credits to the user's profile for selling the item
        const sellPrice = shopItems[itemToSell].price * quantityToSell * 0.5; // Selling at 50% of buying price
        userProfile.coins += sellPrice;

        // Save the updated inventory and user profile
        userProfile.inventory = JSON.stringify(inventory);
        await userProfile.save();

        return interaction.reply({ content: `You sold ${quantityToSell} ${itemToSell}(s) for ${sellPrice} credits.`, ephemeral: true });
      }

      return interaction.reply({ content: 'Item cannot be sold.', ephemeral: true });
    }
  }
};