export const adminMenu = [
    { // Quản lý người dùng
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud', // CRUD user
                link: '/system/user-manage'
            },
            {
                name: 'menu.admin.crud-redux', // CRUD redux
                link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', // Quản lý Bác sĩ
                link: '/system/manage-doctor'
            },
            {
                name: 'menu.admin.manage-admin', // Quản lý Admin
                link: '/system/user-admin'
            }
        ]
    },
    { // Quản lý phòng khám
        name: 'menu.admin.clinic',
        menus: [
            {
                name: 'menu.admin.manage-clinic',
                link: '/system/manage-clinic'
            },
        ]
    },
    { // Quản lý chuyên khoa
        name: 'menu.admin.specialty',
        menus: [
            {
                name: 'menu.admin.manage-specialty',
                link: '/system/manage-specialty'
            },
        ]
    },
    { // Quản lý cẩm nang
        name: 'menu.admin.handbook',
        menus: [
            {
                name: 'menu.admin.manage-handbook',
                link: '/system/manage-handbook'
            },
        ]
    },
];