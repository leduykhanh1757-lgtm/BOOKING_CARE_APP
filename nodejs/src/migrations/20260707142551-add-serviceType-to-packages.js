'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tham số 1: Tên bảng trong DB (Thường là số nhiều, có s)
    // Tham số 2: Tên cột mới
    return queryInterface.addColumn('Packages', 'serviceType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Packages', 'serviceType');
  }
};