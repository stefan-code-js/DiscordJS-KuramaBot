const { Inventory } = require('../models');

// Randomly generate mining rewards
function randomizeMiningRewards() {
    const items = [];

    // Example random items
    const possibleItems = [
        { name: 'Diamond', icon: '💎', quantity: 1 },
        { name: 'Iron Ore', icon: '⛏️', quantity: 3 },
        { name: 'Gold Nugget', icon: '🥇', quantity: 2 }
    ];

    // Add random items to the rewards list
    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        items.push(item);
    }

    // Random credits and XP
    const credits = Math.floor(Math.random() * 100 + 50); // Between 50 and 150 credits
    const xp = Math.floor(Math.random() * 30 + 10); // Between 10 and 40 XP

    return { items, credits, xp };
}

// Decrease durability of a pickaxe after mining
async function decreaseDurability(pickaxe) {
    pickaxe.durability -= 10; // Decrease by 10 per mine
    if (pickaxe.durability < 0) pickaxe.durability = 0;
    await pickaxe.save();
}

module.exports = {
    randomizeMiningRewards,
    decreaseDurability
};

// Randomly generate fishing rewards
function randomizeFishingRewards() {
    const items = [];

    // Example fish items
    const possibleItems = [
        { name: 'Salmon', icon: '🐟', quantity: 1 },
        { name: 'Tuna', icon: '🐠', quantity: 1 },
        { name: 'Shrimp', icon: '🦐', quantity: 2 }
    ];

    // Add random fish to rewards list
    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        items.push(item);
    }

    // Random credits and XP
    const credits = Math.floor(Math.random() * 100 + 50); // Between 50 and 150 credits
    const xp = Math.floor(Math.random() * 30 + 10); // Between 10 and 40 XP

    return { items, credits, xp };
}

module.exports = {
    randomizeFishingRewards,
};

// Randomly generate looting rewards
function randomizeLootRewards() {
    const items = [];

    // Example loot items (pencil, dice, music note, etc.)
    const possibleItems = [
        { name: 'Pencil', icon: '✏️', quantity: 1 },
        { name: 'Dice', icon: '🎲', quantity: 1 },
        { name: 'Music Note', icon: '🎵', quantity: 1 }
    ];

    // Add random items to the rewards list
    for (let i = 0; i < Math.floor(Math.random() * 3 + 1); i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        items.push(item);
    }

    // Random credits and XP
    const credits = Math.floor(Math.random() * 100 + 50); // Between 50 and 150 credits
    const xp = Math.floor(Math.random() * 30 + 10); // Between 10 and 40 XP

    return { items, credits, xp };
}

module.exports = {
    randomizeLootRewards,
};