'use strict';
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const customizeConfig = {
  host: process.env.DB_HOST || 'bookingcare-db-leduykhanh1757-eccb.h.aivencloud.com',
  port: process.env.DB_PORT || 20774,
  dialect: 'mysql',
  logging: false,
  dialectOptions: (process.env.DB_SSL === 'false') ? {} : {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
};

const sequelize = new Sequelize(
  process.env.DB_NAME || 'bookingcare',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASSWORD || '',
  customizeConfig
);

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
