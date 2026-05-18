import {Queue} from 'bullmq';

const connection = {
    host: 'localhost',
    port: 6379
}

export const emailQueue = new Queue('email', {connection});

module.exports = {
    emailQueue,
    connection
}