'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Định nghĩa quan hệ
    }
  };
  Comment.init({
    doctorId: DataTypes.INTEGER,
    authorName: DataTypes.STRING,
    authorAvatar: DataTypes.BLOB('long'),
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comment',
    tableName: 'comments'
  });
  return Comment;
};