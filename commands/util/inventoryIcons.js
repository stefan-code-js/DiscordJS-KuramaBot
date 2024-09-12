const mineIcons = require('./mineIcons');
const fishIcons = require('./fishIcons');
const chopIcons = require('./chopIcons');
const lootIcons = require('./lootIcons');

// Merge all icons from different commands into one object
const inventoryIcons = {
  ...mineIcons,
  ...fishIcons,
  ...chopIcons,
  ...lootIcons,
};

module.exports = inventoryIcons;