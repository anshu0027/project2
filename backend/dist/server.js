"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const promise_1 = require("mysql2/promise");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const pool = (0, promise_1.createPool)({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});
// Create a new user
app.post('/api/user', async (req, res, next) => {
    try {
        const { fname, lname, description, deposit, total_confirmed_amount, currency, status, due_date } = req.body;
        const [result] = await pool.query(`INSERT INTO users (firstname, lastname, introduction, deposit, total_confirmed_amount, currency, status, due_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [fname, lname, description, deposit, total_confirmed_amount, currency, status, due_date]);
        res.status(200).json({ success: true, insertId: result.insertId });
    }
    catch (err) {
        next(err);
    }
});
const handleTransaction = async (req, res, next) => {
    try {
        const { user_id, amount, paymethod, status } = req.body;
        const [[user]] = await pool.query(`SELECT * FROM users WHERE id = ?`, [user_id]);
        if (!user || user.status !== 1) {
            return res.status(400).json({ error: 'User is inactive or does not exist' });
        }
        const [transactionResult] = await pool.query(`SELECT SUM(amount) AS total_paid FROM transactions WHERE user_id = ?`, [user_id]);
        const pastPaidAmount = Number(transactionResult[0]?.total_paid || 0);
        const totalPaid = pastPaidAmount + Number(user.deposit);
        const totalConfirmedAmount = Number(user.total_confirmed_amount);
        const dueAmount = totalConfirmedAmount - totalPaid;
        if (amount > dueAmount) {
            return res.status(400).json({
                error: `Entered amount is more than due amount. Your Due amount is ${dueAmount} ${user.currency}`
            });
        }
        let penalty = 0;
        const currentDate = new Date();
        const userDueDate = new Date(user.due_date);
        if (currentDate > userDueDate) {
            penalty = 0.1 * dueAmount;
        }
        const finalAmount = amount + penalty;
        await pool.query(`INSERT INTO transactions (user_id, amount, currency, status, paymethod, datetime)
       VALUES (?, ?, ?, ?, ?, NOW())`, [user_id, finalAmount, user.currency, status, paymethod]);
        res.status(200).json({ success: true, penalty });
    }
    catch (err) {
        next(err);
    }
};
app.post('/api/transaction', handleTransaction);
app.get('/api/showcase', async (req, res, next) => {
    try {
        const [users] = await pool.query(`SELECT * FROM users`);
        const enrichedUsers = await Promise.all(users.map(async (user) => {
            const [trans] = await pool.query(`SELECT SUM(amount) AS paid FROM transactions WHERE user_id = ?`, [user.id]);
            const paid = (trans[0]?.paid || 0) + Number(user.deposit);
            const due = Number(user.total_confirmed_amount) - paid;
            const completed = due <= 0;
            return {
                id: user.id,
                name: `${user.firstname} ${user.lastname}`,
                user_id: user.id,
                intro: user.introduction.slice(0, 50) + (user.introduction.length > 50 ? '...' : ''),
                deposit: `${user.deposit} ${user.currency}`,
                paid: `${paid} ${user.currency}`,
                due: `${due} ${user.currency}`,
                status: user.status === 1 ? 'Active' : 'Inactive',
                payment_status: completed ? 'Completed' : 'Incomplete'
            };
        }));
        res.status(200).json(enrichedUsers);
    }
    catch (err) {
        next(err);
    }
});
// Delete a user and their transactions
app.delete('/api/user/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await pool.query(`DELETE FROM transactions WHERE user_id = ?`, [id]);
        await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
        res.status(200).json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
app.use((req, res) => {
    res.status(404).json({ error: 'Invalid route or method' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
