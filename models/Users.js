module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.TEXT, 
      allowNull: true,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    badge: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    reputation: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    credits: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    legacyCredits: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    birthday: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    badges: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'Unknown',
    },
    coins: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    streak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastClaimed: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    inventory: {
      type: DataTypes.TEXT, // Store JSON as a string
      allowNull: true,
      defaultValue: JSON.stringify({}),
    },
    crates: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    keys: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    equipment: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    mop_findings: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    coins: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  });


  return Users;
};