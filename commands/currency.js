function randomizeMiningRewards() {
    const items = [];

    // New list of possible items (10 unique items)
    const possibleItems = [
        { name: 'Diamond', icon: '💎', quantity: 1 },
        { name: 'Rock', icon: '🪨', quantity: Math.floor(Math.random() * 3 + 1) },
        { name: 'Gold Nugget', icon: '🪙', quantity: 1 },
        { name: 'Iron Ore', icon: '⛏️', quantity: 3 },
        { name: 'Coal', icon: '🧱', quantity: 2 },
        { name: 'Metal Scrap', icon: '🔧', quantity: 1 },
        { name: 'Wood Chunk', icon: '🪵', quantity: 2 },
        { name: 'Explosive Material', icon: '🧨', quantity: 1 },
        { name: 'Magnet', icon: '🧲', quantity: 1 },
        { name: 'Treasure Chest', icon: '📦', quantity: 1 },
    ];

    // Generate random items (with a chance for 3+ items)
    const itemCount = Math.floor(Math.random() * 3 + 3); // Ensures 3 or more items
    for (let i = 0; i < itemCount; i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        items.push(item);
    }

    // Random credits and XP
    const credits = Math.floor(Math.random() * 100 + 50);
    const xp = Math.floor(Math.random() * 30 + 10);

    return { items, credits, xp };
}
function randomizeFishingRewards() {
    const items = [];

    // List of possible fishing items
    const possibleItems = [
        { name: 'Blue Fish', icon: '🐟', quantity: 1 },
        { name: 'Shrimp', icon: '🦐', quantity: 2 },
        { name: 'Pufferfish', icon: '🐡', quantity: 1 },
        { name: 'Clownfish', icon: '🐠', quantity: 1 },
        { name: 'Lobster', icon: '🦞', quantity: 1 },
        { name: 'Squid', icon: '🦑', quantity: 1 },
        { name: 'Whale', icon: '🐋', quantity: 1 },
        { name: 'Seashell', icon: '🐚', quantity: 2 },
        { name: 'Turtle', icon: '🐢', quantity: 1 },
        { name: 'Fishing Rod', icon: '🎣', quantity: 1 }
    ];

    // Randomly choose more than 3 items
    const itemCount = Math.floor(Math.random() * 3 + 3); // 3 or more items
    for (let i = 0; i < itemCount; i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        items.push(item);
    }

    // Random credits and XP
    const credits = Math.floor(Math.random() * 100 + 50); // 50 to 150 credits
    const xp = Math.floor(Math.random() * 30 + 10); // 10 to 40 XP

    return { items, credits, xp };
}

function randomizeLootRewards() {
    const items = [];

    // List of possible loot items
    const possibleItems = [
        { name: 'Pencil', icon: '✏️', quantity: 1 },
        { name: 'Dice', icon: '🎲', quantity: 1 },
        { name: 'Music Note', icon: '🎵', quantity: 1 },
        { name: 'Juice Box', icon: '🧃', quantity: 1 },
        { name: 'Book', icon: '📚', quantity: 1 },
        { name: 'CD', icon: '📀', quantity: 1 },
        { name: 'Briefcase', icon: '💼', quantity: 1 },
        { name: 'Lightbulb', icon: '💡', quantity: 1 },
        { name: 'Gift Box', icon: '🎁', quantity: 1 },
        { name: 'Key', icon: '🔑', quantity: 1 }
    ];

    // Randomly choose more than 3 items
    const itemCount = Math.floor(Math.random() * 3 + 3); // 3 or more items
    for (let i = 0; i < itemCount; i++) {
        const item = possibleItems[Math.floor(Math.random() * possibleItems.length)];
        items.push(item);
    }

    // Random credits and XP
    const credits = Math.floor(Math.random() * 100 + 50); // 50 to 150 credits
    const xp = Math.floor(Math.random() * 30 + 10); // 10 to 40 XP

    return { items, credits, xp };
}