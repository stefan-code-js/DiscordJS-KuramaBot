const { User, Badge } = require('../models');

async function assignBadge(userId, badgeName) {
    const user = await User.findOne({ where: { userId } });
    const badge = await Badge.findOne({ where: { name: badgeName } });

    if (!badge) {
        console.error(`Badge ${badgeName} does not exist.`);
        return;
    }

    await user.addBadge(badge);
    console.log(`Badge ${badgeName} assigned to user ${userId}.`);
}

module.exports = { assignBadge };