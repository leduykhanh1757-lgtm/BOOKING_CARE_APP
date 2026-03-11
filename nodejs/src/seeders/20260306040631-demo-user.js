'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'leduykhanh@gmail.com',
      password: 'mypassword123',
      firstName: 'Khánh',
      lastName: 'Lê Duy',
      address: 'Hà Nội, Việt Nam',
      gender: true, // true là Nam
      roleId: 'R1', // R1 tương ứng với Admin trong bảng Allcode
      phoneNumber: '0123456789', // Thêm cột số điện thoại
      positionId: 'doctor', // Thêm cột chức danh (doctor, professor...)
      image: 'avatar-link-sample.png', // Thêm cột ảnh đại diện
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};