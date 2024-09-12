require('dotenv').config();

module.exports = {
    "development": {
      "username": "root",
      "password": null,
      "database": "database_development",
      "host": "127.0.0.1",
      "dialect": "sqlite",
      "storage": "./database.sqlite"
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "sqlite",
      "storage": ":memory:"
    },
    "production": {
      "use_env_variable": 'DATABASE_URL',
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "sqlite",
      "storage": "./database.sqlite"
    }
  }