// 导入所需的模块和函数
// jwt: 用于生成、验证和解码 JSON Web Tokens
// User: 用户模型，用于与数据库中的用户集合进行交互
// errorMessage: 用于统一处理和返回错误消息的辅助函数
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorMessage } from "../lib/util.js";
/**
 * jwt: 用于验证JSON Web Token
 * User: 用户模型，用于数据库操作
 * errorMessage: 用于统一的错误消息处理
 * 
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express中间件函数
 * @returns {void}
 */
/**
 * 保护路由中间件，用于验证用户身份并授权访问。
 * 
 * @param {Object} req - Express请求对象，包含客户端发送的请求信息。
 * @param {Object} res - Express响应对象，用于向客户端发送响应。
 * @param {Function} next - Express中间件函数，用于将控制权传递给下一个中间件或路由处理程序。
 * @returns {void} 无返回值，但会根据验证结果调用`next()`或返回错误响应。
 */
export const protectRoute = async (req, res, next) => {
    try {
        // 从请求的cookies中获取JWT令牌
        const token = req.cookies.jwt;

        // 验证JWT令牌并解码
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        // 如果解码失败，返回401未授权错误
        if (!decode) {
            return errorMessage(401, "没有权限", res);
        }

        // 根据解码后的用户ID查找用户，并排除密码字段
        const user = (await User.findById(decode.userId).select("-password"));

        // 如果未找到用户，返回400错误
        if (!user) {
            return errorMessage(400, "Not User", res);
        }

        // 将用户信息附加到请求对象中，供后续中间件或路由处理程序使用
        req.user = user;

        // 继续执行下一个中间件或路由处理程序
        next();
    } catch (error) {
        // 捕获并处理任何异常，返回500服务器错误
        errorMessage(500, error.message, res);
    }
}