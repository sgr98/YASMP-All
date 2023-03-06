import { v4 as uuidv4 } from 'uuid';

export const createMessage = (from, to, content) => {
    const type = typeof content
    let user = {
        message_id: uuidv4(),
        from: from,
        to: to,
        data: {
            type: type,
            content: content,
        },
        datatime: new Date(),
    };
    return user;
};