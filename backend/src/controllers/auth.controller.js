import { generatePrime } from 'crypto';
import cloudinary from '../lib/cloudinary.js';
import { errorMessage, generateToken } from '../lib/util.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
	const { fullName, email, password } = req.body;

	try {
		if (!fullName || !email || !password) {
			errorMessage(400, '所有都是必填项', res);
		}
		const user = await User.findOne({ email });
		if (user) {
			return errorMessage(400, '该邮箱已经存在', res);
		}
		//生成hash密码
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		const newUser = new User({
			fullName,
			email,
			password: hashedPassword
		});

		if (newUser) {
			(await newUser).save();
			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				email: newUser.email,
				profilePic: newUser.profilePic
			});
		} else {
			errorMessage(400, '无效的数据', res);
		}
	} catch (error) {
		res.status(500).send('服务器内部错误');
	}
};
export const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return errorMessage(400, '登录出现错误', res);
		}

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if (!isPasswordCorrect) {
			return errorMessage(400, '登录出现错误', res);
		}
		//生成token
		generateToken(user._id, res);
		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			email: user.email,
			profilePic: user.profilePic
		});
	} catch (error) {
		errorMessage(500, '服务器内部错误', res);
	}
};

/**
 * 退出登录功能
 * 通过清除客户端的jwt cookie实现用户退出登录
 *
 * @param {Object} req - Express请求对象，包含请求相关信息
 * @param {Object} res - Express响应对象，用于发送响应
 */
export const logout = (req, res) => {
	try {
		// 清除客户端的jwt cookie
		res.clearCookie('jwt');
		// 发送200状态码和退出成功的消息
		res.status(200).json({ message: '退出成功' });
	} catch (error) {
		// 处理服务器内部错误
		errorMessage(500, '服务器内部错误', res);
	}
};

export const updateProfile = async (req, res) => {
	try {
		const { profilePic } = req.body;
		const userId = req.user._id;

		if (!profilePic) {
			return errorMessage(400, '图片不能为空', res);
		}

		const uploadResponse = await cloudinary.uploader.upload(profilePic);

		const updateUser = await User.findByIdAndUpdate(
			userId,
			{ profilePic: uploadResponse.secure_url },
			{ new: true }
		);

		res.status(200).json({
			_id: updateUser._id,
			fullName: updateUser.fullName,
			email: updateUser.email,
			profilePic: updateUser.profilePic
		});
	} catch (error) {
		errorMessage(500, '服务器内部错误', res);
	}
};

export const checkAuth = async (req, res) => {
	try {
		res.status(200).json(req.user);
	} catch (error) {
		errorMessage(500, '服务器内部错误', res);
	}
};

/**
 * 密码重置功能
 * 允许已登录用户重置自己的密码
 *
 * @param {Object} req - Express请求对象，包含请求相关信息和用户信息
 * @param {Object} res - Express响应对象，用于发送响应
 */
export const resetPassword = async (req, res) => {
	try {
		const { currentPassword, newPassword } = req.body;
		const userId = req.user._id;

		// 验证请求体中是否包含当前密码和新密码
		if (!currentPassword || !newPassword) {
			return errorMessage(400, '当前密码和新密码都是必填项', res);
		}

		// 验证新密码长度
		if (newPassword.length < 6) {
			return errorMessage(400, '新密码长度必须至少为6个字符', res);
		}

		// 查找用户
		const user = await User.findById(userId);
		if (!user) {
			return errorMessage(404, '用户不存在', res);
		}

		// 验证当前密码是否正确
		const isPasswordCorrect = await bcrypt.compare(
			currentPassword,
			user.password
		);
		if (!isPasswordCorrect) {
			return errorMessage(400, '当前密码不正确', res);
		}

		// 生成新的哈希密码
		const salt = await bcrypt.genSalt(10);
		const hashedNewPassword = await bcrypt.hash(newPassword, salt);

		// 更新用户密码
		user.password = hashedNewPassword;
		await user.save();

		res.status(200).json({ message: '密码重置成功' });
	} catch (error) {
		errorMessage(500, '服务器内部错误', res);
	}
};
