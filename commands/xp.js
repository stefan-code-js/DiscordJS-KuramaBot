/**
 * Utility functions to handle XP progression, level calculations, and progress bars.
 */

// XP required to reach each level
function calculateXPForLevel(level) {
    return 100 * Math.pow(level, 2) - (100 * level); // Adjust formula as needed for your level curve
}

// Calculate the user's current level based on their XP
function calculateLevel(xp) {
    let level = 1;
    while (xp >= calculateXPForLevel(level + 1)) {
        level++;
    }
    return level;
}

// Generate a progress bar showing how close the user is to leveling up
function generateXPProgressBar(currentXP, currentLevel) {
    const xpForNextLevel = calculateXPForLevel(currentLevel + 1);
    const xpForCurrentLevel = calculateXPForLevel(currentLevel);
    const progress = currentXP - xpForCurrentLevel;
    const total = xpForNextLevel - xpForCurrentLevel;
    const progressBarLength = 20; // Length of the progress bar

    const filledLength = Math.floor((progress / total) * progressBarLength);
    const bar = '█'.repeat(filledLength) + '░'.repeat(progressBarLength - filledLength);

    return `${bar} (${progress}/${total} XP)`;
}

module.exports = {
    calculateXPForLevel,
    calculateLevel,
    generateXPProgressBar
};