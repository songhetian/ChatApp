import express from 'express';
import {
	login,
	logout,
	signup,
	updateProfile,
	checkAuth,
	resetPassword
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// 以下代码定义了认证相关的路由，每个路由对应不同的认证操作。
// 这些路由将处理用户注册、登录、注销、更新资料、检查认证状态和重置密码等功能。
// 部分路由需要通过 protectRoute 中间件进行认证保护。

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);
router.put('/reset-password', protectRoute, resetPassword);

export default router;
