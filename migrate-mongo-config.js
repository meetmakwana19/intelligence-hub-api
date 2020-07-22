require('dotenv').config();

const config = {
  mongodb: {
    url: process.env.MONGO_DB_URI,

    databaseName: process.env.MONGO_DB_NAME,

    options: {
      useNewUrlParser: true, // removes a deprecation warning when connecting
      useUnifiedTopology: true, // removes a deprecating warning when connecting
      //   connectTimeoutMS: 3600000, // increase connection timeout to 1 hour
      //   socketTimeoutMS: 3600000, // increase socket timeout to 1 hour
    }
  },

  migrationsDir: "migrations",

  changelogCollectionName: "migrations_changelog",

  migrationFileExtension: ".js"
};

module.exports = config;
