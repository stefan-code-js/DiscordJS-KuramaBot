const { ShopItem } = require('../models');

// Seeding items into the shop
await ShopItem.bulkCreate([
    // Common items
    { name: 'Blue Fish', icon: '🐟', buyPrice: 50, sellPrice: 25 },
    { name: 'Shrimp', icon: '🦐', buyPrice: 40, sellPrice: 20 },
    { name: 'Rock', icon: '🪨', buyPrice: 30, sellPrice: 15 },
    { name: 'Wood Chunk', icon: '🪵', buyPrice: 20, sellPrice: 10 },
    { name: 'Pencil', icon: '✏️', buyPrice: 25, sellPrice: 10 },
    { name: 'Briefcase', icon: '💼', buyPrice: 40, sellPrice: 20 },

    // Uncommon items
    { name: 'Treasure Chest', icon: '📦', buyPrice: 150, sellPrice: 75 },
    { name: 'Gold Nugget', icon: '🪙', buyPrice: 120, sellPrice: 60 },
    { name: 'CD', icon: '📀', buyPrice: 100, sellPrice: 50 },
    { name: 'Metal Scrap', icon: '🔧', buyPrice: 80, sellPrice: 40 },
    { name: 'Pufferfish', icon: '🐡', buyPrice: 90, sellPrice: 45 },
    { name: 'Magnet', icon: '🧲', buyPrice: 110, sellPrice: 55 },

    // Rare items
    { name: 'Diamond', icon: '💎', buyPrice: 300, sellPrice: 150 },
    { name: 'Lobster', icon: '🦞', buyPrice: 250, sellPrice: 125 },
    { name: 'Explosive Material', icon: '🧨', buyPrice: 200, sellPrice: 100 },
    { name: 'Gift Box', icon: '🎁', buyPrice: 180, sellPrice: 90 },
    { name: 'Whale', icon: '🐋', buyPrice: 400, sellPrice: 200 },
    { name: 'Key', icon: '🔑', buyPrice: 150, sellPrice: 75 },

    // Tools
    { name: 'Pickaxe', icon: '⛏️', buyPrice: 150, sellPrice: 75 },
    { name: 'Fishing Rod', icon: '🎣', buyPrice: 100, sellPrice: 50 },
    { name: 'Repair Wrench', icon: '🔧', buyPrice: 200, sellPrice: 100 }
]);
await ShopItem.bulkCreate([
    { name: 'Star Gem', icon: '🌟', buyPrice: 500, sellPrice: 250 },
    { name: 'Fire Gem', icon: '🔥', buyPrice: 550, sellPrice: 275 },
    { name: 'Water Gem', icon: '🌊', buyPrice: 600, sellPrice: 300 },
    { name: 'Mermaid Gem', icon: '🧜', buyPrice: 650, sellPrice: 325 }
]);
