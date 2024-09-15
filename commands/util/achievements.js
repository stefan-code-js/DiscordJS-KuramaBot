const { Achievement, Inventory } = require('../models');

// Check if a user has unlocked an achievement for a specific activity
async function checkForAchievements(userId, activity) {
    const userAchievements = await Achievement.findAll({ where: { userId } });

    // Example mining achievements
    if (activity === 'mine') {
        const miningCount = await Inventory.count({ where: { userId, itemName: 'Pickaxe' } });

        if (miningCount >= 10 && !userAchievements.some(a => a.badgeName === 'Novice Miner')) {
            // Unlock "Novice Miner" badge
            await Achievement.create({
                userId,
                badgeName: 'Novice Miner',
                badgeIcon: '⛏️', // Pickaxe emoji
            });

            // Notify the user they unlocked a badge
            return `🏅 You unlocked the **Novice Miner** badge!`;
        }
    }

    // Example fishing achievements
    if (activity === 'fish') {
        const fishingCount = await Inventory.count({ where: { userId, itemName: 'Fishing Rod' } });

        if (fishingCount >= 10 && !userAchievements.some(a => a.badgeName === 'Novice Fisher')) {
            // Unlock "Novice Fisher" badge
            await Achievement.create({
                userId,
                badgeName: 'Novice Fisher',
                badgeIcon: '🐟', // Fish emoji
            });

            return `🏅 You unlocked the **Novice Fisher** badge!`;
        }
    }

    // Example looting achievements
    if (activity === 'loot') {
        const lootCount = await Inventory.count({ where: { userId, itemName: 'Pencil' } });

        if (lootCount >= 10 && !userAchievements.some(a => a.badgeName === 'Loot Explorer')) {
            // Unlock "Loot Explorer" badge
            await Achievement.create({
                userId,
                badgeName: 'Loot Explorer',
                badgeIcon: '🎉', // Celebration emoji
            });

            return `🏅 You unlocked the **Loot Explorer** badge!`;
        }
    }

    return null; // No badge unlocked
}

module.exports = { checkForAchievements };