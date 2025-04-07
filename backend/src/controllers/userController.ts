import { pool } from '../db/pool';
import { RequestHandler } from 'express';

export const createUser: RequestHandler = async (req, res, next) => {
    try {
        const { fname, lname, description, deposit, total_confirmed_amount, currency, status, due_date } = req.body;
        const [result]: any = await pool.query(
            `INSERT INTO users (firstname, lastname, introduction, deposit, total_confirmed_amount, currency, status, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [fname, lname, description, deposit, total_confirmed_amount, currency, status, due_date]
        );
        res.status(200).json({ success: true, insertId: result.insertId });
    } catch (err) {
        next(err);
    }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        await pool.query(`DELETE FROM transactions WHERE user_id = ?`, [id]);
        await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
        res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};

export const getShowcaseUsers: RequestHandler = async (req, res, next) => {
    try {
        const [users]: any = await pool.query(`SELECT * FROM users`);

        const enrichedUsers = await Promise.all(
            users.map(async (user: any) => {
                const [trans]: any = await pool.query(
                    `SELECT SUM(amount) AS paid FROM transactions WHERE user_id = ?`,
                    [user.id]
                );
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
                    payment_status: completed ? 'Completed' : 'Incomplete',
                };
            })
        );

        res.status(200).json(enrichedUsers);
    } catch (err) {
        next(err);
    }
};
