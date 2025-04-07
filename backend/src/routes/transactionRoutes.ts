import express from 'express';
import { handleTransaction } from '../controllers/transactionController';

const router = express.Router();

router.post('/transaction', handleTransaction);

export default router;
