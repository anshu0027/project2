import { createPool } from 'mysql2/promise';

export const pool = createPool({
    host: "localhost",
    user: "anshu",
    password: "@Nshu@123",
    database: 'xillentech',
});
