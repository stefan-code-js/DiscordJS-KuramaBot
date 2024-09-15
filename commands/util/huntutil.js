const { emojis } = require('./emojis');

function getHuntRewards() {
    const items = [
        { name: 'Kunai', icon: emojis.kunai, quantity: Math.floor(Math.random() * 3 + 1) },
        { name: 'Jutsu Scroll', icon: emojis.shadowClone, quantity: 1 },
        { name: 'Coins', icon: emojis.coins, quantity: Math.floor(Math.random() * 1000 + 500) }
    ];

    const xp = Math.floor(Math.random() * 100 + 50);
    const coins = Math.floor(Math.random() * 2000 + 1000);

    return { xp, coins, items };
}

function getLocationRewards(location) {
    let xp, coins, items;
    
    switch(location) {
        case 'Forest of Death':
            xp = Math.floor(Math.random() * 200 + 100);
            coins = Math.floor(Math.random() * 3000 + 1500);
            items = [
                { name: 'Orochimaru’s Scroll', icon: emojis.scroll, quantity: 1 },
                { name: 'Kunai', icon: emojis.kunai, quantity: Math.floor(Math.random() * 2 + 1) }
            ];
            break;

        case 'Valley of the End':
            xp = Math.floor(Math.random() * 300 + 200);
            coins = Math.floor(Math.random() * 4000 + 2500);
            items = [
                { name: 'Water Release Scroll', icon: emojis.waterScroll, quantity: 1 },
                { name: 'Kunai', icon: emojis.kunai, quantity: Math.floor(Math.random() * 3 + 1) }
            ];
            break;

        case 'Hidden Leaf Village':
            xp = Math.floor(Math.random() * 150 + 75);
            coins = Math.floor(Math.random() * 2500 + 1200);
            items = [
                { name: 'Fire Release Scroll', icon: emojis.fireScroll, quantity: 1 },
                { name: 'Shuriken', icon: emojis.shuriken, quantity: Math.floor(Math.random() * 3 + 2) }
            ];
            break;

        default:
            return getHuntRewards();
    }

    return { xp, coins, items };
}

module.exports = { getHuntRewards, getLocationRewards };