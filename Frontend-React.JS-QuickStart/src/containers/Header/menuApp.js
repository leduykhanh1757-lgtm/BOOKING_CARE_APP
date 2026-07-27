export const adminMenu = [
    { // Quản lý hệ thống Người dùng & Bác sĩ
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.admin.crud-redux', // Quản lý Người dùng (Redux)
                link: '/system/user-redux'
            },
            {
                name: 'menu.admin.manage-doctor', // Quản lý Bác sĩ
                link: '/system/manage-doctor'
            },
            {
                name: 'menu.doctor.manage-schedule', // Quản lý lịch khám
                link: '/doctor/manage-schedule'
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
    { // Quản lý Gói khám
        name: 'menu.admin.package',
        menus: [
            {
                name: 'menu.admin.manage-package',
                link: '/system/manage-package'
            }
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

export const doctorMenu = [
    {
        name: 'menu.admin.manage-user',
        menus: [
            {
                name: 'menu.doctor.manage-schedule',
                link: '/doctor/manage-schedule'
            },
            {
                name: 'menu.doctor.manage-patient',
                link: '/doctor/manage-patient'
            },
        ]
    },
];