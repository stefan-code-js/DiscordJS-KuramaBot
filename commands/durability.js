const { Inventory } = require('../models');

// Repair the durability of a user's item
async function repairItem(userId, itemName, repairAmount = 50) {
    const userItem = await Inventory.findOne({ where: { userId, itemName } });
    if (!userItem) {
        return { success: false, message: 'Item not found in your inventory.' };
    }

    // Repair the item by a fixed amount (default 50 durability)
    userItem.durability = Math.min(100, userItem.durability + repairAmount);
    await userItem.save();

    return { success: true, message: `You repaired your ${itemName}. It now has ${userItem.durability} durability.` };
}

module.exports = { repairItem };