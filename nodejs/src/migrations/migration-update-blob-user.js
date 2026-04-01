module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            // Đổi cột 'image' của bảng 'Users' sang kiểu BLOB dạng long
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            // Nếu muốn quay xe (rollback) thì trả nó về kiểu STRING cũ
            queryInterface.changeColumn('Users', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};