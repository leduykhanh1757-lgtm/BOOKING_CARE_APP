'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Handbook extends Model {
        static associate(models) {
            // define association here nếu cần liên kết bảng
        }
    };
    Handbook.init({
        name: DataTypes.STRING,
        descriptionHTML: DataTypes.TEXT('long'),
        descriptionMarkdown: DataTypes.TEXT('long'),
        image: DataTypes.BLOB('long') // Lưu ảnh dưới dạng Base64
    }, {
        sequelize,
        modelName: 'Handbook',
    });
    return Handbook;
};