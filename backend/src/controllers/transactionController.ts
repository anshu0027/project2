import { pool } from '../db/pool';
import { Request, Response, NextFunction } from 'express';

export const handleTransaction = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { user_id, amount, paymethod, status } = req.body;

        const [[user]]: any = await pool.query(
            `SELECT * FROM users WHERE id = ?`,
            [user_id]
        );

        if (!user || user.status !== 1) {
            res.status(400).json({ error: 'User is inactive or does not exist' });
            return;
        }

        const [transactionResult]: any = await pool.query(
            `SELECT SUM(amount) AS total_paid FROM transactions WHERE user_id = ?`,
            [user_id]
        );

        const pastPaidAmount = Number(transactionResult[0]?.total_paid || 0);
        const totalPaid = pastPaidAmount + Number(user.deposit);
        const totalConfirmedAmount = Number(user.total_confirmed_amount);
        const dueAmount = totalConfirmedAmount - totalPaid;

        if (amount > dueAmount) {
            res.status(400).json({
                error: `Entered amount is more than due amount. Your Due amount is ${dueAmount} ${user.currency}`,
            });
            return;
        }

        let penalty = 0;
        const currentDate = new Date();
        const userDueDate = new Date(user.due_date);

        if (currentDate > userDueDate) {
            penalty = 0.1 * dueAmount;
        }

        const finalAmount = amount + penalty;

        await pool.query(
            `INSERT INTO transactions (user_id, amount, currency, status, paymethod, datetime)
       VALUES (?, ?, ?, ?, ?, NOW())`,
            [user_id, finalAmount, user.currency, status, paymethod]
        );

        res.status(200).json({ success: true, penalty });
    } catch (err) {
        next(err);
    }
};
