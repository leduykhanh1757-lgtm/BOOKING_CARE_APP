'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Like extends Model { };
  Like.init({
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Like',
    tableName: 'likes'
  });
  return Like;
};