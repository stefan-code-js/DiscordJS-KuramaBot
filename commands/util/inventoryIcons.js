const mineIcons = require('./mineIcons');
const fishIcons = require('./fishIcons');
const chopIcons = require('./chopIcons');
const lootIcons = require('./lootIcons');
const mopIcons = require('./mopIcons');
const crateIcons = require('./crateIcons');
const shopItems = require('./shopItems');
const consumableItems = require('./consumableItems');
// Merge all icons from different commands into one object
const inventoryIcons = {
  ...mineIcons,
  ...fishIcons,
  ...chopIcons,
  ...lootIcons,
  ...mopIcons,
  ...crateIcons,
  ...shopItems, 
  ...consumableItems// Add shop items to inventory icons
};

module.exports = inventoryIcons;
