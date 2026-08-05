'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      // define association here
    }
  };
  Message.init({
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    senderRole: DataTypes.STRING,
    senderName: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages'
  });
  return Message;
};
