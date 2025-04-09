import jwt from 'jsonwebtoken';
// 导入 jsonwebtoken 库
// 用于生成和验证 JWT (JSON Web Tokens)
export const generateToken = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: '7d'
	});
	res.cookie('jwt', token, {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		sameSite: 'strict',
		secure: false
	});

	return token;
};

export const errorMessage = (statusCode, message, res) => {
	return res.status(statusCode).json({ message });
};

export const decodeToken = async token => {
	await jwt.verify;
};
