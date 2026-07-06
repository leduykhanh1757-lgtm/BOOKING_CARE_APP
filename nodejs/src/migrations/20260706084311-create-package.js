'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Packages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      clinicId: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.BLOB('long'), // 🛠️ BẮT BUỘC PHẢI LÀ BLOB('long') để chứa ảnh Base64
        allowNull: true,
      },
      descriptionHTML: {
        type: Sequelize.TEXT('long'), // Dùng TEXT('long') để chứa bài viết dài
        allowNull: true,
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT('long'),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Packages');
  }
};