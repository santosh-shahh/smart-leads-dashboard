import express from 'express';
import { registerUser, loginUser, googleAuth, guestAuth } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/guest', guestAuth);

export default router;
