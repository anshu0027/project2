import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import transactionRoutes from './routes/transactionRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', transactionRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Invalid route or method' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
