import express from 'express';
import { createUser, deleteUser, getShowcaseUsers } from '../controllers/userController';

const router = express.Router();

router.post('/user', createUser);
router.delete('/user/:id', deleteUser);
router.get('/showcase', getShowcaseUsers);

export default router;
