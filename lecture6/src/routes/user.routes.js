// import {Router} from 'express';
// import { registerUser } from '../controllers/user.controller';

// const router = Router();

// router.route('/register').post(registerUser);

// export default router;

// user.routes.js
import express from 'express';
const router = express.Router();

router.post('/register', (req, res) => {
    res.json({ message: 'User registered successfully!' });
});

export default router;