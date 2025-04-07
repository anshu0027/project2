import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: 'xillentech',
});
