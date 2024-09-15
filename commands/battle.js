/**
 * Utility functions for handling PvP battles, battle outcomes, and leaderboards.
 */

// Calculate battle outcome between two users based on their stats
function getBattleOutcome(user, opponent) {
    // Define a battle power metric for both users
    const userPower = calculatePower(user);
    const opponentPower = calculatePower(opponent);

    // Random chance factor for both sides
    const userChance = Math.random() * 10;
    const opponentChance = Math.random() * 10;

    // Calculate the final outcome based on power and chance
    const userFinalPower = userPower + userChance;
    const opponentFinalPower = opponentPower + opponentChance;

    // Determine the winner
    if (userFinalPower > opponentFinalPower) {
        return { success: true, xpGained: 1000, coinsGained: 500 };
    } else {
        return { success: false, xpGained: 200, coinsGained: 100 };
    }
}

// Calculate a user's battle power based on XP, level, and other stats
function calculatePower(user) {
    const level = calculateLevel(user.xp);  // Assuming calculateLevel is imported from xp.js
    const xpFactor = user.xp / (level * 100); // XP influence
    const chakraFactor = user.chakra / 100;  // Chakra level influence (if applicable)

    return level * xpFactor + chakraFactor;
}

// Update the PvP leaderboard after a battle
async function updateLeaderboard(user, opponent, battleResult) {
    // Assuming User model has a wins and losses field
    if (battleResult.success) {
        user.wins += 1;
        opponent.losses += 1;
    } else {
        user.losses += 1;
        opponent.wins += 1;
    }

    // Add XP and coins based on the battle outcome
    user.xp += battleResult.xpGained;
    user.credits += battleResult.coinsGained;

    opponent.xp += battleResult.xpGained / 2;
    opponent.credits += battleResult.coinsGained / 2;

    await user.save();
    await opponent.save();
}

// Generate a battle report for the user and opponent
function generateBattleReport(user, opponent, battleResult) {
    return {
        title: '⚔️ Battle Report',
        description: battleResult.success
            ? `**${user.username}** defeated **${opponent.username}**!`
            : `**${user.username}** was defeated by **${opponent.username}**.`,
        fields: [
            { name: 'XP Gained', value: `${battleResult.xpGained} XP`, inline: true },
            { name: 'Coins Gained', value: `${battleResult.coinsGained} coins`, inline: true }
        ],
        footer: 'Keep battling to climb the ranks!'
    };
}

module.exports = {
    getBattleOutcome,
    calculatePower,
    updateLeaderboard,
    generateBattleReport
};