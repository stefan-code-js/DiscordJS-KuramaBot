const sequelize = require('./config/database');

sequelize.sync({ alter: true }).then(() => {
    console.log('Database schema updated successfully');
}).catch((error) => {
    console.error('Error updating database schema:', error);
});