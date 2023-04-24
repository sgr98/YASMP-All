import {
    USERS,
    SAVE_DIR_DATA,
    SAVE_DIR_REGISTRY,
    SAVE_REGISTRY_FILE,
    SAVE_DIR_USER,
    SAVE_PACKAGE,
    SAVE_SERVER_DATA,
    SAVE_SERVER_DATA_REGISTRY,
    SAVE_SERVER_PACKAGE,
    SAVE_SERVER_TOTAL_SEQUENCE,
} from './config.mjs';
import { addUsers, getTotalSequence, saveJSONFile } from './create_user.mjs';
import { createDir, addUserSpace } from './create_user_space.mjs';
import { addScriptsSavePackage } from './configure_react_scripts.mjs';

const createMetaSpace = async (type = '') => {
    if (type === '') {
        //  ////////////////////////////////
        //  FOR YASMP
        //  ////////////////////////////////

        await createDir(SAVE_DIR_REGISTRY);
        await createDir(SAVE_DIR_USER);

        console.log('REGISTRY CREATION STARTED');
        const registry_path = SAVE_DIR_REGISTRY + SAVE_REGISTRY_FILE;
        await addUsers(USERS, registry_path);
        console.log('REGISTRY CREATED');

        console.log('USERS CREATION STARTED');
        USERS.forEach(async (val, ind, array) => {
            if (!val.isGroup) {
                const { user_name } = val;
                console.log('USER:', user_name);
                const paths = {
                    regPath: registry_path,
                    dirPath: SAVE_DIR_USER,
                };

                const dirPath = SAVE_DIR_USER + user_name;
                await createDir(dirPath);
                await addUserSpace(user_name, paths);
            }
        });
        console.log('USERS CREATED');

        console.log('PACKAGE JSON UPDATE');
        await addScriptsSavePackage(USERS, SAVE_PACKAGE);
        console.log('PACKAGE JSON UPDATE COMPLETED');
    } else if (type === 'server') {
        //  ////////////////////////////////
        //  FOR YASMP server
        //  ////////////////////////////////

        await createDir(SAVE_SERVER_DATA_REGISTRY);

        console.log('(SERVER) REGISTRY CREATION STARTED');
        const server_path = SAVE_SERVER_DATA_REGISTRY + SAVE_REGISTRY_FILE;
        await addUsers(USERS, server_path);
        console.log('(SERVER) REGISTRY CREATED');

        console.log('(SERVER) TOTAL SEQUENCE CREATION STARTED');
        const totalSequenceObj = getTotalSequence(SAVE_DIR_REGISTRY + SAVE_REGISTRY_FILE);
        await saveJSONFile(totalSequenceObj, SAVE_SERVER_TOTAL_SEQUENCE);
        console.log('(SERVER) TOTAL SEQUENCE CREATED');

        console.log('(SERVER) PACKAGE JSON UPDATE');
        await addScriptsSavePackage(
            USERS,
            SAVE_SERVER_PACKAGE,
            (type = 'server')
        );
        console.log('(SERVER) PACKAGE JSON UPDATE COMPLETED');
    }
};

await createMetaSpace();
await createMetaSpace('server');
