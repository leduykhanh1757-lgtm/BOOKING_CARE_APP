'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Package.init({
    name: DataTypes.STRING,
    price: DataTypes.STRING,
    clinicId: DataTypes.INTEGER,
    image: DataTypes.BLOB('long'), // BẮT BUỘC PHẢI LÀ BLOB('long') để chứa ảnh Base64
    descriptionHTML: DataTypes.TEXT('long'), // Dùng TEXT('long') để chứa bài viết dài
    descriptionMarkdown: DataTypes.TEXT('long')
  }, {
    sequelize,
    modelName: 'Package',
  });
  return Package;
};