export const USERS = [
    {
        user_name: 'User1',
        port: '4001',
        isGroup: false,
    },
    {
        user_name: 'User2',
        port: '4002',
        isGroup: false,
    },
    {
        user_name: 'User3',
        port: '4003',
        isGroup: false,
    },
    {
        user_name: 'User4',
        port: '4004',
        isGroup: false,
    },
    {
        user_name: 'Group_Chat',
        port: ['4001', '4002', '4003', '4004'],
        isGroup: true,
    },
];

export const SAVE_DIR_DATA = '../yasmp/src/Data/';
export const SAVE_DIR_REGISTRY = '../yasmp/src/Data/Registry/';
export const SAVE_REGISTRY_FILE = 'users.json';
export const SAVE_DIR_USER = '../yasmp/src/Data/User/';
export const SAVE_PACKAGE = '../yasmp/package.json';

export const SAVE_SERVER_DATA = '../yasmpseer/Data/';
export const SAVE_SERVER_DATA_REGISTRY = '../yasmpseer/Data/Registry/';
export const SAVE_SERVER_PACKAGE = '../yasmpseer/package.json';
export const SAVE_SERVER_TOTAL_SEQUENCE = '../yasmpseer/Data/total_sequence.json';
