import cloudinary from '../lib/cloudinary.js';
import { errorMessage } from '../lib/util.js';
import Message from '../models/message.model.js';
import User from '../models/user.model.js';

export const getUsersForSidebar = async (req, res) => {
	try {
		const users = await User.find({ _id: { $ne: req.user._id } }).select(
			'email profilePic fullName'
		); //假设User是你的用户模型
		res.status(200).json(users);
	} catch (error) {
		errorMessage(500, error.message, res);
	}
};

export const getMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			$or: [
				// 在MongoDB中，ObjectId需要进行类型转换才能正确比较
				// 使用toString()方法将ObjectId转换为字符串进行比较1
				{
					senderId: req.user._id.toString(),
					receiverId: req.params.id.toString()
				},
				{ senderId: req.user._id, receiverId: req.params.id },
				{ senderId: req.params.id, receiverId: req.user._id }
			]
		}); //假设Message是你的消息模型
		console.log(req.user._id.toString());
		console.log(req.params.id);

		res.status(200).json(messages); //返回当前用户的信息，包括消息记录等其他字段，根据你的需求调整返回的字段
	} catch (error) {
		errorMessage(500, error.message, res);
	}
};

/**
 * 发送消息的函数
 *
 * 该函数用于处理发送消息的请求。它接收请求和响应对象，从请求中提取接收者ID、消息文本和图片，
 * 并将消息保存到数据库中。如果消息中包含图片，图片将被上传到Cloudinary，并返回图片的URL。
 * 最后，函数将保存的消息作为响应返回。
 *
 * @param {Object} req - 请求对象，包含请求参数和请求体
 * @param {Object} res - 响应对象，用于返回响应数据
 * @returns {Promise<void>} 无返回值，但会通过res对象返回响应
 */
export const sendMessage = async (req, res) => {
	try {
		// 从请求参数中获取接收者ID
		const receiverId = req.params.id;
		// 从请求体中获取消息文本和图片
		const { text, image } = req.body;

		// 检查消息文本是否为空，如果为空则返回错误信息
		if (!text) {
			return errorMessage(400, '消息不能为空', res);
		}


		let newImage = '';
		// 如果请求中包含图片，则上传到Cloudinary并获取图片的URL
		if (image) {
			const uploadResponse = await cloudinary.uploader.upload(image);
			newImage = uploadResponse.secure_url;
		}

		// 创建新的消息对象，包含发送者ID、接收者ID、消息文本和图片URL
		const newMessage = new Message({
			senderId: req.user._id,
			receiverId,
			text,
			image: newImage
		});

		// 将消息保存到数据库
		await newMessage.save();
		// 发送socket.io通知
		res.status(200).json(newMessage);
	} catch (error) {
		// 如果发生错误，返回500状态码和错误信息
		errorMessage(500, error.message, res);
	}
};
