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