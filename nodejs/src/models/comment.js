'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Định nghĩa quan hệ (sau này có thể nối với bảng Doctor)
    }
  };
  Comment.init({
    doctorId: DataTypes.INTEGER,
    authorName: DataTypes.STRING,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};