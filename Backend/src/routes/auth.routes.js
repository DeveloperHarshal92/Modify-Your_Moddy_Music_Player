import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authUser } from '../middleware/auth.middleware.js';

const router = Router();
/**
 *  @Route POST api/auth/register
 */
router.post('/register', authController.registerUser);
/**
 *  @Route POST api/auth/login
 */
router.post('/login', authController.loginUser);

/**
 * @Route GET api/auth/get-me
 */
router.get('/get-me', authUser, authController.getMe);
/**
 * @Route GET api/auth/logout
 */
router.get('/logout', authController.logOutUser);
export default router;
